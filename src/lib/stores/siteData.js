import { writable, readable, derived } from 'svelte/store';
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
	jurisdictionData.map((d) => ({ display: d.NAME, JURISDICTION_ID: d.GISJOIN }))
);
export const jurisdiction = writable(null);

export const demographic = writable(null);
export const demographicOpts = readable([
	{ display: 'Population Density', key: 'Pop_density' },
	{ display: 'Cost Burdended', key: 'Cost_burdened' }
]);

export const stationType = writable(null);
export const stationTypeOpts = readable(
	[...new Set(stationData.map((d) => d.mode))].map((d) => ({ display: d, key: d }))
);

export const reformType = writable(null);
export const reformTypeOpts = readable([
	{ display: 'Baseline', key: 'baseline_under_zoning' },
	{ display: 'Plexify', key: 'plexify_reform' },
	{ display: 'Multiply', key: 'multiply_reform' },
	{ display: 'Legalize', key: 'legalize_reform' },
	{ display: 'Missing Middle', key: 'middle_reform' },
	{ display: 'All', key: 'all_reforms' }
]);

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

export const demographicLayer = derived(
	[jurisdiction, demographic],
	([$jurisdiction, $demographic]) => {}
);
