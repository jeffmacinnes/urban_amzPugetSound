<script>
	import { onMount, onDestroy } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import {
		updateJurisdictionLayer,
		updateDemographicLayer,
		updateTransitLinesLayer,
		updateStationsLayer,
		updateHousingLayer,
		setLayerOrder
	} from './js/layers';

	import {
		MAPBOX_API_KEY,
		geoData,
		mapView,
		demographicLayerData,
		stationsLayerData,
		stationType,
		reformType
	} from '$stores/siteData';
	import { initialViewState } from './js/toolUtils';

	let map = null;
	let mapLoaded = false;
	let deck = null;
	let mapRef;
	let mapStyle = 'mapbox://styles/urbaninstitute/cleoryx1x000101my2y9cr08m';
	onMount(() => {
		// setup mapbox
		console.log('mapbox token', $MAPBOX_API_KEY);
		map = new mapboxgl.Map({
			accessToken: $MAPBOX_API_KEY,
			container: mapRef,
			antialias: true,
			interactive: true,
			style: mapStyle,
			center: [initialViewState.longitude, initialViewState.latitude],
			zoom: initialViewState.zoom,
			pitch: initialViewState.pitch,
			bearing: initialViewState.bearing
		});
		map.on('load', function () {
			map.resize();
			mapLoaded = true;

			// DEBUGGING
			updateLayers(['jurisdiction', 'demographic', 'transitLines', 'stations', 'housing']);
			updateView();
		});
	});

	const updateView = () => {
		if (!map) return;
		if (!mapLoaded) return;
		if (Object.keys($mapView).length === 0) return;
		let { lng, lat, zoom, pitch, bearing } = $mapView;
		map.flyTo({
			center: [lng, lat],
			zoom,
			pitch,
			bearing,
			speed: 0.5,
			essential: true // this animation is considered essential with respect to prefers-reduced-motion
		});
	};

	const updateLayers = (layersArr) => {
		if (!map) return;
		if (!mapLoaded) return;
		if (Object.keys($geoData).length === 0) return;

		console.log('updating layers: ', layersArr);

		// loop over each layer in layersArr and call the corresponding update fn
		layersArr.forEach((layerName) => {
			switch (layerName) {
				case 'jurisdiction':
					updateJurisdictionLayer(map);
					break;
				case 'demographic':
					updateDemographicLayer(map);
					break;
				case 'transitLines':
					updateTransitLinesLayer(map);
					break;
				case 'stations':
					updateStationsLayer(map);
					break;
				case 'housing':
					updateHousingLayer(map);
					break;
				default:
					console.log('Can not find a layer that matches ', layerName);
			}
		});
		setLayerOrder(map);
	};

	// map update triggers
	$: $mapView, updateView();
	$: $geoData, updateLayers(['jurisdiction', 'demographic']);
	$: $demographicLayerData, updateLayers(['demographic']);
	$: $stationsLayerData, updateLayers(['transitLines', 'stations', 'housing']);
	$: $reformType, updateLayers(['housing']);
	$: console.log($geoData);
</script>

<div class="map-container">
	<div id="map" bind:this={mapRef} />
</div>

<style lang="scss">
	.map-container {
		position: relative;
		width: auto;
		height: 100%;
		min-height: 300px;
		border: solid 1px var(--color-white);
	}

	#map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		// border: solid 1px blue;
	}

	#deck-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
