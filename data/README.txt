
--- RAW DATA -------------------
Jurisdictions:
	- Yonah shared shape files for all jurisdictions. Next, I used the "Split Vector Layer" in QGIS to export separate geojson files for each jurisdiction, using the GISJOIN field as the name. 
	- QGIS was also used to compute and export a geojson file of centroids for each jurisdiction

Tracts:
	- Aleszu used an R script to produce geojson files for each jurisdiction (with Yonah's data as the original source files). Each file contains all of the census tracts that fall within that jurisdiction

Stations:
	- Aleszu used an R script to produce geojson files for each jurisdiction (with Yonah's data as the original source files). Each file contains all of the stations that fall within that jurisdiction
