/* Script to prep the non-geo data for the tool. This includes data for:
  - CSV tables showing demographic data by census tract
  - CSV tables showing housing availability by station

The processed output files will be stored in <repo>/src/lib/data
*/

import fs from 'fs';
import csv from 'csvtojson';
import fastcsv from 'fast-csv';
import stringHash from 'string-hash';

const outputDir = '../src/lib/data';

const prepJurisdictionData = async () => {
	console.log('...preparing Jurisdiction data');

	// load raw data
	const input = '../data/raw/jurisdictions/census_place_data.csv';
	let jurisdictionData = await csv().fromFile(`${input}`);

	// filter out the two locations to exclude per Yonah
	const excludedLocations = ['Edgewood', 'University Place'];
	jurisdictionData = jurisdictionData.filter((d) => !excludedLocations.includes(d.NAME));

	// rename GISJOIN prop to something more specific
	jurisdictionData = jurisdictionData.map((d) => {
		let geoID = d.GISJOIN;
		delete d.GISJOIN;
		return {
			JURISDICTION_ID: geoID,
			...d
		};
	});

	// write output file
	const dst = `${outputDir}/jurisdictionData.csv`;
	const ws = fs.createWriteStream(dst);
	fastcsv.write(jurisdictionData, { headers: true }).pipe(ws);
};

const prepTractData = async () => {
	console.log('...preparing Tracts data');

	const inputDir = '../data/raw/tracts';

	// TRACTS ARE NOT UNIQUELY ASSOCIATED WITH JUST A SINGLE JURISDICTION
	// --- Build a lookup table from the geo data that links each Tract ID to a specific Jurisdiction ID
	// let LUT = [];
	// fs.readdirSync(inputDir).forEach((file) => {
	// 	if (file.split('.').pop() !== 'geojson') return;
	// 	const raw = fs.readFileSync(`${inputDir}/${file}`);
	// 	let data = JSON.parse(raw);

	// 	// get the GISJOIN ID for this jurisdiction (same for all tracts in this file)
	// 	const JURISDICTION_ID = data.features[0].properties.GISJOIN;

	// 	// add the set of tract IDs and Jurisdiction ID for these tracts to the LUT
	// 	let tractIDs = data.features.map((d) => d.properties['GISJOIN.1']);
	// 	LUT = [...LUT, ...tractIDs.map((d) => ({ TRACT_ID: d, JURISDICTION_ID }))];
	// });

	// --- Read the raw tract data csv, clean up and format
	let tractData = await csv().fromFile(`${inputDir}/census_tract_data.csv`);
	tractData = tractData.map((d) => {
		let TRACT_ID = d.GISJOIN;
		// const match = LUT.find((d) => d.TRACT_ID === TRACT_ID);
		// const JURISDICTION_ID = match ? match.JURISDICTION_ID : 'NA';
		delete d.GISJOIN;
		return {
			TRACT_ID,
			...d
		};
	});

	// write output file
	const dst = `${outputDir}/tractData.csv`;
	const ws = fs.createWriteStream(dst);
	fastcsv.write(tractData, { headers: true }).pipe(ws);
};

const prepStationsData = async () => {
	console.log('...preparing Stations Data');

	// --- Build a lookup table from the geo data that links each Station ID to a specific Jurisdiction ID
	let LUT = [];
	const inputDir = '../data/raw/stations';
	fs.readdirSync(inputDir).forEach((file) => {
		if (file.split('.').pop() !== 'geojson') return;
		const raw = fs.readFileSync(`${inputDir}/${file}`);
		let data = JSON.parse(raw);

		// add the set of Station IDs and Jurisdiction ID for these tracts to the LUT
		LUT = [
			...LUT,
			...data.features.map((d) => ({
				JURISDICTION_ID: d.properties.GISJOIN,
				STATION_ID: `S${stringHash(d.properties.station_link)}` // if this method changes, need to update prepGeoData.js to match
			}))
		];
	});

	// --- Read the raw station data csv, clean up and format
	let stationData = await csv().fromFile(`${inputDir}/stations_table_for_tool.csv`);
	stationData = stationData
		.map((d) => {
			const STATION_ID = `S${stringHash(d.station_link)}`;
			const match = LUT.find((d) => d.STATION_ID === STATION_ID);
			const JURISDICTION_ID = match ? match.JURISDICTION_ID : 'NA';
			return {
				JURISDICTION_ID,
				STATION_ID,
				...d
			};
		})
		.filter((d) => d.JURISDICTION_ID !== 'NA');

	// write output file
	const dst = `${outputDir}/stationData.csv`;
	const ws = fs.createWriteStream(dst);
	fastcsv.write(stationData, { headers: true }).pipe(ws);
};

(async () => {
	await prepJurisdictionData();
	await prepTractData();
	await prepStationsData();
})();
