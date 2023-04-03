<script>
	import { onMount, onDestroy } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import Tooltip from './Tooltip.svelte';
	import {
		MAPBOX_API_KEY,
		geoData,
		mapView,
		demographicLayerData,
		stationsLayerData,
		stationType,
		reformType
	} from '$stores/siteData';
	import { initialViewState, updateView, updateLayers } from './js/mapUtils';

	let tooltipRef;
	let map = null;
	let mapRef;
	let mapStyle = 'mapbox://styles/urbaninstitute/cleoryx1x000101my2y9cr08m';
	onMount(() => {
		// setup mapbox
		map = new mapboxgl.Map({
			accessToken: $MAPBOX_API_KEY,
			container: mapRef,
			antialias: true,
			dragPan: true,
			dragRotate: true,
			scrollZoom: true,
			style: mapStyle,
			center: [initialViewState.longitude, initialViewState.latitude],
			zoom: initialViewState.zoom,
			pitch: initialViewState.pitch,
			bearing: initialViewState.bearing
		});
		map.on('style.load', function () {
			map.resize();
			updateLayers(map, ['jurisdiction', 'demographic', 'transitLines', 'stations', 'housing']);
			updateView(map, $mapView);
		});

		map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
	});

	let mx = 0;
	let my = 0;
	const handleMouseMove = (e) => {
		// get x and y position within the map
		const rect = e.target.getBoundingClientRect();
		mx = e.clientX - rect.left;
		my = e.clientY - rect.top;
	};

	// map update triggers
	$: $mapView, updateView(map, $mapView);
	$: $geoData, updateLayers(map, ['jurisdiction', 'demographic']);
	$: $demographicLayerData, updateLayers(map, ['demographic']);
	$: $stationsLayerData, updateLayers(map, ['transitLines', 'stations', 'housing']);
	$: $reformType, updateLayers(map, ['housing']);
</script>

<div class="map-container" on:mousemove|preventDefault={handleMouseMove}>
	<div id="map" bind:this={mapRef} />
	<Tooltip x={mx} y={my} />
	<!-- <div id="tooltips" style:top={`${ttTop}px`} style:left={`${ttLeft}px`} /> -->
</div>

<style lang="scss">
	.map-container {
		position: relative;
		width: 100%;
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
</style>
