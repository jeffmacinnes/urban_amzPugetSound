<script>
	import { onMount, onDestroy } from 'svelte';
	import mapboxgl from 'mapbox-gl';

	import { Deck, FlyToInterpolator } from '@deck.gl/core';
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';

	import { initialViewState } from './toolUtils';

	let map = null;
	let mapRef, deckRef, mapCtx, deckCtx;
	let mapStyle = 'mapbox://styles/jeffmacinnes/cka6el67h0hng1imogwwb9mkc';

	onMount(() => {
		// map = new mapboxgl.Map({
		// 	accessToken: PUBLIC_MAPBOX_API_KEY,
		// 	container: mapRef,
		// 	style: mapStyle,
		// 	interactive: true
		// });

		// setup mapbox
		map = new mapboxgl.Map({
			accessToken: PUBLIC_MAPBOX_API_KEY,
			container: mapRef,
			interactive: false,
			style: mapStyle,
			center: [initialViewState.longitude, initialViewState.latitude],
			zoom: initialViewState.zoom,
			pitch: initialViewState.pitch,
			bearing: initialViewState.bearing
		});
		map.on('load', () => map.resize());

		deck = new Deck({
			canvas: deckRef,
			width: '100%',
			height: '100%',
			initialViewState,
			controller: true,
			onViewStateChange: ({ viewState }) => {
				map.jumpTo({
					center: [viewState.longitude, viewState.latitude],
					zoom: viewState.zoom,
					bearing: viewState.bearing,
					pitch: viewState.pitch
				});
			}
		});
	});
</script>

<div class="map-container">
	<div id="map" bind:this={mapRef} />
	<canvas id="deck-canvas" bind:this={deckRef} />
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
