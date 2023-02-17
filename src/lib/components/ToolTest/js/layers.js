import { get } from 'svelte/store';
import { geoData, jurisdiction, demographic, demographicLayerData } from '$stores/siteData';

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
	console.log('layers', layers);
	for (const layer of layers) {
		if (layer.type === 'symbol') {
			return layer.id;
		}
	}
	return null;
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
