import { writable, derived } from 'svelte/store';
import jurisdictionData from '$data/jurisdictionData.csv';

export const jurisdictionOpts = writable(
	jurisdictionData.map((d) => ({ display: d.NAME, JURISDICTION_ID: d.GISJOIN }))
);
export const jurisdiction = writable(null);

export const placeGeo = writable([]);
export const tractsGeo = writable([]);
export const stationsGeo = writable([]);
