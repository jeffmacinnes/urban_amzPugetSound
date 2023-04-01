import { get } from 'svelte/store';
import { reformType, stationsLayerData } from '$stores/siteData';
import { removeLayer } from './mapUtils';
import { color } from '$data/variables.json';
import { Threebox, THREE } from 'threebox-plugin';

//
const defaultOpacity = 0.65;
const outlineColor = new THREE.Color('#111');
const hoveredOutlineColor = new THREE.Color('#fff');

const generateStationObj = (data) => {
	/* 
		Build the station obj. Each station will be a stacked column comprised of sections
		for existing housing units, housing units added under current zoning, and housing
		units added under reformed zoning
	*/
	console.log('data', data);

	const { existing, currentZoning, reformedZoning } = data;

	// config settings for determining column type
	let totalUnits = existing + currentZoning + reformedZoning;
	let useLargeCols = totalUnits > 50_000;

	// --- Create the parent station object
	let baseDim = 100; // units are meters
	let heightScalar = 0.075;
	if (useLargeCols) {
		let colScalar = 6;
		baseDim = Math.sqrt(baseDim * baseDim * colScalar); // make the footprint colScalar times bigger
		heightScalar = heightScalar / colScalar; // scale the height colScalar times less
	}
	const stationObj = new THREE.Group();

	// --- Create subcolumns for each section
	const colSections = [
		{ nUnits: existing, color: outlineColor },
		{ nUnits: currentZoning, color: color['gray-darkest'] },
		{ nUnits: reformedZoning, color: useLargeCols ? color['magenta'] : color['yellow'] }
	];
	let totalH = 0; // init var to track the growing height with each bar
	colSections
		.filter((d) => d.nUnits > 0)
		.forEach((d, i) => {
			const barH = d.nUnits * heightScalar;
			const bar = new THREE.Mesh(
				new THREE.BoxGeometry(baseDim, baseDim, barH),
				new THREE.MeshPhysicalMaterial({
					color: d.color,
					opacity: defaultOpacity,
					transparent: true,
					side: THREE.DoubleSide,
					depthTest: true,
					depthWrite: true
				})
			);
			let barPosZ = totalH + barH / 2;
			bar.position.set(0, 0, barPosZ);

			var geometry = new THREE.EdgesGeometry(bar.geometry);
			var material = new THREE.LineBasicMaterial({ color: '#444' });
			var wireframe = new THREE.LineSegments(geometry, material);
			wireframe.position.set(0, 0, barPosZ);

			// add to the parent stationObj
			stationObj.add(bar);
			stationObj.add(wireframe);

			// update the total barH
			totalH = totalH + barH;
		});

	// Elevate the stationObj slightly off the ground plane
	stationObj.position.set(0, 0, -50);

	return stationObj;
};

// --- 3D BARS FOR HOUSING LAYER --------------------------------------
export const updateHousingLayer = (map) => {
	// --- Prep data for this layer
	let reformOpt = get(reformType);
	let layerData = get(stationsLayerData);

	// add props for each station that make clear the baseline value, and how many additional the current reform option would add
	let data = layerData.data.map((d) => {
		// each of these values will represent the # of units specific to that category only
		let existing = +d['existing_housing_units'];
		let currentZoning = +d['baseline_under_zoning'] - existing;
		let reformedZoning = +d[reformOpt] - +d['baseline_under_zoning'];
		let coords = [+d.lat, +d.long];
		return {
			existing,
			currentZoning,
			reformedZoning,
			coords
		};
	});

	// add to map
	const id = `housing-layer`;
	removeLayer(map, id);

	map.addLayer({
		id,
		type: 'custom',
		renderingMode: '3d',
		onAdd: function (map, gl) {
			window.tb = new Threebox(
				map,
				gl, //get the context from Mapbox
				{
					defaultLights: true,
					enableSelectingObjects: true
				}
			);

			// add columns for each stations
			data.forEach((d) => {
				let stationObj = generateStationObj(d);

				let tower = tb.Object3D({
					obj: stationObj,
					units: 'meters',
					anchor: 'center',
					tooltip: true
				});
				tower.setCoords(d.coords);
				tower.addEventListener('ObjectMouseOver', handleStationMouseover, false);
				tower.addEventListener('ObjectMouseOut', handleStationMouseout, false);
				tower.addEventListener('SelectedChange', handleStationSelect, false);
				tb.add(tower);
			});

			// Make the default hovered/selected materials invisible
			tb.objects._defaults.materials.boxSelectedMaterial = new THREE.LineBasicMaterial({
				color: '#000',
				transparent: true,
				opacity: 0
			});
			tb.objects._defaults.materials.boxOverMaterial = new THREE.LineBasicMaterial({
				color: '#000',
				transparent: true,
				opacity: 0
			});
		},
		render: function (gl, matrix) {
			tb.update(); //update Threebox scene
		}
	});
};

function handleStationMouseover(e) {
	let obj = e.detail.model;

	// walk through children column sections, making outlines white and faces opaque
	obj.children.forEach((child) => {
		if (child.isLineSegments) {
			child.material.color = hoveredOutlineColor;
		}

		if (child.isMesh) {
			child.material.opacity = 1;
		}
	});
}

function handleStationMouseout(e) {
	let obj = e.detail.model;

	// walk through children column sections, reset outlines and faces
	obj.children.forEach((child) => {
		if (child.isLineSegments) {
			child.material.color = outlineColor;
		}

		if (child.isMesh) {
			child.material.opacity = defaultOpacity;
		}
	});
}

function handleStationSelect(e) {
	let selectedObj = e.detail;
}
