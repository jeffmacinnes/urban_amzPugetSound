<script>
	export let geoJson;
	export let centerCoords;

	import { onMount } from 'svelte';

	import { Deck, FlyToInterpolator } from '@deck.gl/core';
	import getTileLayer from './layers/tilee';
	import getHexagonLayer from './layers/hexagonn';

	let deckgl;
	let mapElement;
	let layers = [];

	const deckGlConfig = {
		// Alternative: verbissproz_ob_drittel
		GEOJSON_PROPERTY_NAME: 'value',
		GEOJSON_PROPERTY_NAME_READABLE: 'Verbissprozent',
		GEOJSON_PROPERTY_UNIT: '%',
		DEFAULT_HEXAGON_RADIUS: 500,
		TILE_SERVER: [
			'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
			'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
			'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
		]
	};

	const INITIAL_VIEW_STATE = {
		latitude: 51.163375,
		longitude: 10.447683,
		zoom: 5,
		pitch: 60,
		bearing: 0
	};

	const setCenter = (center) => {
		if (!deckgl) return;

		console.log('setting center');
		deckgl.setProps({
			initialViewState: {
				...INITIAL_VIEW_STATE,
				transitionDuration: 4000,
				transitionEasing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
				transitionInterpolator: new FlyToInterpolator(),
				longitude: center[0],
				latitude: center[1],
				zoom: 8
			}
		});
	};

	const update = (geoJson) => {
		if (!deckgl) return;

		layers = [];

		if (deckGlConfig.TILE_SERVER) layers.push(getTileLayer(deckGlConfig.TILE_SERVER));

		if (geoJson) {
			layers.push(
				getHexagonLayer(
					'hex-layer',
					geoJson.features,
					deckGlConfig.DEFAULT_HEXAGON_RADIUS,
					deckGlConfig.GEOJSON_PROPERTY_NAME
				)
			);
		}

		deckgl.setProps({ layers: layers });
	};

	const handleButton = () => {
		console.log('clicked');
		let lng = Math.random() * 100;
		let lat = Math.random() * 90;
		setCenter([lng, lat]);
	};

	onMount(() => {
		console.log('DECKGL');
		deckgl = new Deck({
			parent: mapElement,
			initialViewState: INITIAL_VIEW_STATE,
			controller: {},
			layers: layers,
			getTooltip: ({ object }) => {
				return (
					object &&
					object.elevationValue && {
						className: 'sdg-tooltip',
						html: `<div>
                                <span class="sdg-tooltip-title">${
																	deckGlConfig.GEOJSON_PROPERTY_NAME_READABLE
																}</span><br/>
                                <span class="sdg-tooltip-value">${
																	Math.round(object.elevationValue * 10) / 10
																} ${deckGlConfig.GEOJSON_PROPERTY_UNIT}</span>
                            </div>`
					}
				);
			}
		});

		update();
	});

	$: [update(geoJson), setCenter(centerCoords)];
</script>

<div class="map" bind:this={mapElement} />
<slot />
<button class="button1" on:click={handleButton}>CLICK ME</button>

<style>
	.button1 {
		position: fixed;
		top: 0;
		z-index: 10;
		margin: 20px;
	}

	:global(.sdg-tooltip) {
		text-align: center;
	}
	:global(.sdg-tooltip-value) {
		font-size: 3em;
	}
</style>
