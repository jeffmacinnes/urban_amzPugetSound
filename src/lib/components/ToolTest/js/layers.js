import { get } from 'svelte/store';
import { geoData, demographicLayerData, stationsLayerData, reformType } from '$stores/siteData';
import circle from '@turf/circle';
import union from '@turf/union';
import { Threebox, THREE } from 'threebox-plugin';

// import * as THREE from 'three';

import { color } from '$data/variables.json';
import chroma from 'chroma-js';

import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

const removeLayer = (map, id) => {
	if (map.getLayer(id)) {
		map.removeLayer(id);
	}
	if (map.getSource(id)) {
		map.removeSource(id);
	}
};

const getLabelsLayerID = (map) => {
	// return the id of the layer containing labels
	const layers = map.getStyle().layers;
	// console.log('layers', layers);
	for (const layer of layers) {
		if (layer.type === 'symbol') {
			return layer.id;
		}
	}
	return null;
};

// -- OUTLINE AROUND CURRENT JURISDICTION --------------------------------------
export const updateJurisdictionLayer = (map) => {
	const id = `jurisdiction-layer`;

	// remove this layer if it already exists
	removeLayer(map, id);

	// --- Prep the data for this layer
	let data = get(geoData);
	data = data.jurisdiction;

	// --- Add to map
	map.addSource(id, {
		type: 'geojson',
		data
	});
	map.addLayer({
		id: id,
		source: id,
		type: 'line',
		paint: {
			'line-color': '#000',
			'line-width': 2
		}
	});
};

// -- CHOROPLETH SHOWING DEMOGRAPHIC DATA --------------------------------------
export const updateDemographicLayer = (map) => {
	const id = `demographic-layer`;

	// remove this layer if it already exists;
	removeLayer(map, id);

	// --- Prep data for this layer
	let geo = get(geoData); // <- geojson for current tracts
	let layerProps = get(demographicLayerData); // <- tract data (from csv)

	// add 'color' to each tract feature's properties object (in geo data)
	let data = geo.tracts;
	data.features = data.features.map((d) => {
		const tractID = d.properties.TRACT_ID;
		const match = layerProps.data.find((d) => d.TRACT_ID === tractID);
		d.properties.color = match ? match.color : '#f00';
		return d;
	});

	let labelLayerId = getLabelsLayerID(map);

	// --- Add to map
	map.addSource(id, {
		type: 'geojson',
		data
	});
	map.addLayer(
		{
			id,
			source: id,
			type: 'fill',
			paint: {
				'fill-color': ['get', 'color']
			}
		},
		labelLayerId
	);
};

// --- STATION LOCATIONS --------------------------------------
export const updateStationsLayer = (map) => {
	// --- Prep data for this layer
	let geo = get(geoData);
	let layerProps = get(stationsLayerData);

	// filter stations geo data to only include currently selected station types
	const stationIDs = layerProps.data.map((d) => d.STATION_ID);
	let data = JSON.parse(JSON.stringify(geo.stations)); // copy so we can mutate original
	data.features = data.features.filter((d) => stationIDs.includes(d.properties.STATION_ID));

	// --- Circles showing each stations location
	let id = `stations-layer`;
	removeLayer(map, id);

	// add to map
	map.addSource(id, {
		type: 'geojson',
		data
	});
	map.addLayer({
		id,
		source: id,
		type: 'circle',
		paint: {
			'circle-color': '#000',
			'circle-radius': 7,
			'circle-pitch-alignment': 'map'
		}
	});

	// -- AREA AROUND STATION
	id = `stations-area-layer`;
	removeLayer(map, id);

	// create a "area" circle around each station
	let radius = 0.5; // half mile radius around each station
	let circles = data.features.map((d) => {
		let center = d.geometry.coordinates;
		return circle(center, radius, {
			steps: 30,
			units: 'miles',
			properties: d.properties
		});
	});

	// combine overlapping areas into single polygon
	let combined = circles[0];
	for (let c of circles) {
		combined = union(combined, c);
	}
	data.features = [combined];

	// --- Add station areas to map
	let labelLayerId = getLabelsLayerID(map);
	map.addSource(id, {
		type: 'geojson',
		data
	});
	map.addLayer(
		{
			id,
			source: id,
			type: 'fill',
			paint: {
				'fill-color': 'rgba(255,255,0,.3)'
				// 'fill-outline-color': '#000'
			}
		},
		labelLayerId
	);
};

// --- 3D BARS FOR HOUSING LAYER --------------------------------------
export const updateHousingLayer = (map) => {
	// --- Prep data for this layer
	let reformOpt = get(reformType);
	let layerData = get(stationsLayerData);

	// add props for each station that make clear the baseline value, and how many additional the current reform option would add
	let data = layerData.data.map((d) => {
		let baseline = +d['baseline_under_zoning'];
		let additional = +d[reformOpt] - baseline;
		let coords = [+d.lat, +d.long];
		return {
			baseline,
			additional,
			coords,
			...d
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
				{ defaultLights: true }
			);

			// add columns for each stations
			data.forEach((d) => {
				// -- Parent Group
				const group = new THREE.Group();
				let scalar = 0.03;

				// -- Baseline bar
				let baselineH = d.baseline * scalar;
				const baselineBar = new THREE.Mesh(
					new THREE.BoxGeometry(100, 100, baselineH),
					new THREE.MeshStandardMaterial({ color: '#696969', opacity: 1, roughness: 1 })
				);
				baselineBar.position.set(0, 0, 0);
				group.add(baselineBar);

				if (d.additional > 0) {
					// --- Added houses Bar
					const addedBarH = d.additional * scalar;
					const addedBar = new THREE.Mesh(
						new THREE.BoxGeometry(100, 100, addedBarH),
						new THREE.MeshStandardMaterial({ color: '#FDC11B', opacity: 1, roughness: 1 })
					);
					let addedBarZ = 0.5 * (baselineH + addedBarH); // each bar is positioned based on origin at center of obj
					addedBar.position.set(0, 0, addedBarZ);
					group.add(addedBar);
				}

				// DEBUGGING
				// let hA = 200;
				// let hB = 800;
				// const geometryA = new THREE.BoxGeometry(100, 100, hA);
				// const geometryB = new THREE.BoxGeometry(100, 100, hB);
				// const materialA = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.9 });
				// const materialB = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 0.9 });

				// const cubeA = new THREE.Mesh(geometryA, materialA);
				// cubeA.position.set(0, 0, 0);

				// const cubeB = new THREE.Mesh(geometryB, materialB);
				// cubeB.position.set(50, 50, 0.5 * hA + 0.5 * hB);

				// const group = new THREE.Group();
				// group.add(cubeA);
				// group.add(cubeB);

				let tower = tb.Object3D({ obj: group, units: 'meters', anchor: 'center' });
				tower.setCoords(d.coords);
				tb.add(tower);
			});
		},
		render: function (gl, matrix) {
			tb.update(); //update Threebox scene
		}
	});

	console.log('housing data', data);
};
