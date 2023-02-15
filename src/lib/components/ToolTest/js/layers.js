import { get } from 'svelte/store';
import { geoData } from '$stores/siteData';
import { color } from '$data/variables.json';
import chroma from 'chroma-js';

import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

export const updateJurisdictionLayer = (map) => {
	const id = `jurisdiction-layer`;

	// remove this layer if it already exists
	if (map.getLayer(id)) {
		map.removeLayer(id);
	}
	if (map.getSource(id)) {
		map.removeSource(id);
	}

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

export const updateDemographicLayer = () => {};
