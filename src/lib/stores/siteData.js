import { writable, readable, derived } from 'svelte/store';
import * as d3 from 'd3';

import jurisdictionsCentroids from '$data/jurisdictionsCentroids.csv';
import jurisdictionData from '$data/jurisdictionData.csv';
import tractData from '$data/tractData.csv';
import stationData from '$data/stationData.csv';

// all data is hosted at github URL
const baseURL = 'https://raw.githubusercontent.com/jeffmacinnes/urban_amzPugetSound/main/data/geo/';
const getGeo = async (jurisdictionID) => {
	let geo = {};
	let resp;

	// fetch the 3 different geo files for this jurisdiction
	resp = await fetch(`${baseURL}/${jurisdictionID}_jurisdiction.geojson`);
	geo['jurisdiction'] = await resp.json();

	resp = await fetch(`${baseURL}/${jurisdictionID}_tracts.geojson`);
	geo['tracts'] = await resp.json();

	resp = await fetch(`${baseURL}/${jurisdictionID}_stations.geojson`);
	geo['stations'] = await resp.json();

	return geo;
};

// --- Set up drop down options
export const jurisdictionOpts = readable(
	jurisdictionData.map((d) => ({ display: d.NAME, JURISDICTION_ID: d.JURISDICTION_ID }))
);
export const demographicOpts = readable([
	{ display: 'Population Density', key: 'Pop_density' },
	{ display: 'Cost Burdended', key: 'Cost_burdened' }
]);
export const stationTypeOpts = readable(
	[...new Set(stationData.map((d) => d.mode)), 'All'].map((d) => ({ display: d, key: d }))
);
export const reformTypeOpts = readable([
	{ display: 'None', key: 'no_reforms' },
	{ display: 'Baseline', key: 'baseline_under_zoning' },
	{ display: 'Plexify', key: 'plexify_reform' },
	{ display: 'Multiply', key: 'multiply_reform' },
	{ display: 'Legalize', key: 'legalize_reform' },
	{ display: 'Missing Middle', key: 'middle_reform' },
	{ display: 'All', key: 'all_reforms' }
]);

// defaults (make sure these line up with what is set in OPTIONS.svelte)
export const jurisdiction = writable('G53063000'); // set the default here, and make sure it maps to what is set in Options.svelte
export const demographic = writable('Pop_density');
export const stationType = writable('All');
export const reformType = writable('None');

// --- Set up datasets for each "view" of map
export const mapView = derived(jurisdiction, ($jurisdiction) => {
	if (!$jurisdiction) {
		return {};
	}
	const { lat, lng } = jurisdictionsCentroids.find((d) => d.JURISDICTION_ID === $jurisdiction);
	return {
		lat,
		lng,
		pitch: 60,
		zoom: 12
	};
});

export const geoData = derived(jurisdiction, ($jurisdiction, set) => {
	// this should only be called whenever the jurisdiction changes so as to minimize
	// the calls to fetch the remote geoData
	set({});
	if (!$jurisdiction) {
		return;
	}
	getGeo($jurisdiction).then((data) => set(data));
});

// --- Define the data for each layer based on current options
export const demographicLayerData = derived([geoData, demographic], ([$geoData, $demographic]) => {
	if (!$geoData.tracts) return { data: [] };

	// filter data to only include tracts within this jurisdiction
	const currentTracts = $geoData.tracts.features.map((d) => d.properties.TRACT_ID);
	let data = tractData
		.filter((d) => currentTracts.includes(d.TRACT_ID))
		.map((d) => ({
			TRACT_ID: d.TRACT_ID,
			value: +d[$demographic]
		}));

	// set up color scale for current selection
	const colorScale = d3
		.scaleSequential(d3.interpolateBlues)
		.domain(d3.extent(tractData.map((d) => d[$demographic])));

	// compute colors for each tract
	data = data.map((d) => ({ ...d, color: colorScale(d.value) }));

	// TO-DO: legend details...
	return {
		data,
		colorScale
	};
});

// export const demographicLayerData = derived(
// 	[jurisdiction, demographic],
// 	([$jurisdiction, $demographic]) => {
// 		// filter data to only include tracts within this jurisdiction
// 		let data = tractData
// 			.filter((d) => d.JURISDICTION_ID === $jurisdiction)
// 			.map((d) => ({
// 				TRACT_ID: d.TRACT_ID,
// 				value: +d[$demographic]
// 			}));

// 		// set up color scale for current selection
// 		const colorScale = d3
// 			.scaleLinear()
// 			.domain(d3.extent(data.map((d) => d.value)))
// 			.range(['#FFFFFF', '#023858'])
// 			.interpolate(d3.interpolateLab);

// 		// compute colors for each tract
// 		data = data.map((d) => ({ ...d, color: colorScale(d.value) }));

// 		// TO-DO: legend details...
// 		return {
// 			data,
// 			colorScale
// 		};
// 	}
// );
