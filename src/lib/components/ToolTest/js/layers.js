import { get } from 'svelte/store';
import { geoData, jurisdiction, demographic, demographicLayerData } from '$stores/siteData';
import rawTractsData from '$data/tractData.csv';

import { color } from '$data/variables.json';
import chroma from 'chroma-js';

import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

console.log('raw tracts', rawTractsData);

const removeLayer = (map, id) => {
	if (map.getLayer(id)) {
		map.removeLayer(id);
	}
	if (map.getSource(id)) {
		map.removeSource(id);
	}
};

export const updateJurisdictionLayer = (map) => {
	const id = `jurisdiction-layer`;

	// remove this layer if it already exists
	removeLayer(map, id);

	// get the data for this layer
	let data = get(geoData);
	data = data.jurisdiction;

	// add source and layer
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
			'line-width': 3
		}
	});
};

export const updateDemographicLayer = (map) => {
	const id = `demographic-layer`;

	// remove this layer if it already exists;
	removeLayer(map, id);

	// --- Prep data for this layer
	// get the set of geo IDs for the current tracts
	let geo = get(geoData);
	let tractIDs = geo.tracts.features.map((d) => d.properties.TRACT_ID);

	// filter the raw tract csv to only include these current tracts
	let demographicVar = get(demographic);
	let data = rawTractsData
		.filter((d) => tractIDs.includes(d.GISJOIN))
		.map((d) => ({
			id: d.GISJOIN,
			value: +d[demographicVar]
		}));

	// update the demographic layer data store to reflect the current tracts and demographic variabl selected
	demographicLayerData.set(data);

	console.log('demographic data', demographicVar, data);
};
