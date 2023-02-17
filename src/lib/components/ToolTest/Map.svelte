<script>
	import { onMount, onDestroy } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { updateJurisdictionLayer, updateDemographicLayer } from './js/layers';
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
	import { geoData, mapView, demographicLayerData } from '$stores/siteData';
	import { initialViewState } from './js/toolUtils';

	let map = null;
	let deck = null;
	let mapRef;
	let mapStyle = 'mapbox://styles/jeffmacinnes/cka6el67h0hng1imogwwb9mkc';

	onMount(() => {
		// setup mapbox
		map = new mapboxgl.Map({
			accessToken: PUBLIC_MAPBOX_API_KEY,
			container: mapRef,
			interactive: true,
			style: mapStyle,
			center: [initialViewState.longitude, initialViewState.latitude],
			zoom: initialViewState.zoom,
			pitch: initialViewState.pitch,
			bearing: initialViewState.bearing
		});
		map.on('load', function () {
			map.resize();
		});
	});

	const updateView = () => {
		if (!map) return;
		if (Object.keys($mapView).length === 0) return;
		let { lng, lat, zoom, pitch } = $mapView;
		map.flyTo({
			center: [lng, lat],
			zoom,
			pitch,
			speed: 0.5,
			essential: true // this animation is considered essential with respect to prefers-reduced-motion
		});
	};

	const updateLayers = (layersArr) => {
		if (!map) return;
		if (Object.keys($geoData).length === 0) return;

		// loop over each layer in layersArr and call the corresponding update fn
		layersArr.forEach((layerName) => {
			switch (layerName) {
				case 'jurisdiction':
					updateJurisdictionLayer(map);
					break;
				case 'demographic':
					updateDemographicLayer(map);
					break;
				default:
					console.log('Can not find a layer that matches ', layerName);
			}
		});
	};

	// map update triggers
	$: $mapView, updateView();
	$: $geoData, updateLayers(['jurisdiction', 'demographic']);
	$: $demographicLayerData, updateLayers(['demographic']);
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
