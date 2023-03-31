import { get } from 'svelte/store';
import { reformType, stationsLayerData } from '$stores/siteData';
import { removeLayer } from './mapUtils';
import { color } from '$data/variables.json';

import { Threebox, THREE } from 'threebox-plugin';

const generateColumn = (data) => {
	// turn the station data into a column
	console.log('data', data);
};

// --- 3D BARS FOR HOUSING LAYER --------------------------------------
export const updateHousingLayer = (map) => {
	// --- Prep data for this layer
	let reformOpt = get(reformType);
	let layerData = get(stationsLayerData);

	// add props for each station that make clear the baseline value, and how many additional the current reform option would add
	let data = layerData.data.map((d) => {
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
					// enableTooltips: true
				}
			);

			// add columns for each stations
			data.forEach((d) => {
				generateColumn(d);
				// -- Parent Group
				const group = new THREE.Group();
				let scalar = 0.03;

				// -- Baseline bar
				const opacity = 0.65;
				let baselineH = d.baseline * scalar;
				const baselineBar = new THREE.Mesh(
					new THREE.BoxGeometry(100, 100, baselineH),
					new THREE.MeshPhongMaterial({
						color: color['gray-darker'],
						opacity,
						transparent: true,
						side: THREE.DoubleSide
					})
				);
				baselineBar.position.set(0, 0, 0);
				group.add(baselineBar);

				if (d.additional > 0) {
					// --- Added houses Bar
					const addedBarH = d.additional * scalar;
					const addedBar = new THREE.Mesh(
						new THREE.BoxGeometry(100, 100, addedBarH),
						new THREE.MeshPhongMaterial({
							color: color.yellow,
							opacity,
							transparent: true,
							side: THREE.DoubleSide
						})
					);
					let addedBarZ = 0.5 * (baselineH + addedBarH); // each bar is positioned based on origin at center of obj
					addedBar.position.set(0, 0, addedBarZ);
					group.add(addedBar);
				}

				// lift up
				group.position.set(0, 0, -50);

				let tower = tb.Object3D({ obj: group, units: 'meters', anchor: 'center', tooltip: true });
				tower.setCoords(d.coords);
				tower.addEventListener('ObjectMouseOver', handleMouseover, false);
				tb.add(tower);
			});
		},
		render: function (gl, matrix) {
			tb.update(); //update Threebox scene
		}
	});
};

function handleMouseover(e) {
	console.log(e);
}
