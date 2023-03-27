<script>
	import { onMount, onDestroy } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { MAPBOX_API_KEY } from '$stores/siteData';
	import { Threebox, THREE } from 'threebox-plugin';

	let map = null;
	let mapLoaded = false;
	let mapRef;
	let mapStyle = 'mapbox://styles/mapbox/light-v9';
	const coords = [-122.3457, 47.756];

	onMount(() => {
		// setup mapbox
		let popup;
		map = new mapboxgl.Map({
			accessToken: $MAPBOX_API_KEY,
			container: 'map',
			antialias: true,
			style: mapStyle,
			center: coords,
			zoom: 17,
			pitch: 60
		});
		map.on('style.load', function () {
			map.resize();
			mapLoaded = true;

			map.addLayer({
				id: 'custom_layer',
				type: 'custom',
				renderingMode: '3d',
				onAdd: function (map, mbxContext) {
					// instantiate threebox
					window.tb = new Threebox(map, mbxContext, {
						defaultLights: true,
						enableSelectingObjects: true
						// enableTooltips: true // change this to false to disable default tooltips on fill-extrusion and 3D models
					});

					//instantiate a red sphere and position it at the origin lnglat
					var sphere = tb
						.sphere({ radius: 5, color: 'red', material: 'MeshToonMaterial' })
						.setCoords(coords);
					sphere.addEventListener('ObjectMouseOver', onObjectMouseOver, false);
					sphere.addEventListener('ObjectMouseOut', onObjectMouseOut, false);

					// add sphere to the scene
					tb.add(sphere);
				},

				render: function (gl, matrix) {
					tb.update();
				}
			});
		});

		//actions to execute onObjectMouseOver
		function onObjectMouseOver(e) {
			console.log('hovered', e.detail.name);

			// console.log(e.target);
			let feature = e.detail;

			let center = [];

			console.log(feature);

			feature.model.material.color = { r: 1, g: 1, b: 0 };
			let coords = feature.coordinates;

			// --- 2 approaches:
			// ADD LABEL USING THREEBOX (pro: centers on object)
			feature.addLabel(createTooltip(), true, feature.anchor, 0.95); // (html, visible?, center, height)

			// OR USE BUILT IN MAPBOX POPUP (pro: maybe has some addtional features?)
			// if (popup) popup.remove();
			// popup = new mapboxgl.Popup({
			// 	offset: 50,
			// 	closeButton: false,
			// 	closeOnClick: true,
			// 	closeOnMove: true
			// })
			// 	.setLngLat(coords)
			// 	.setHTML(createTooltip())
			// 	.addTo(map);
		}

		//actions to execute onObjectMouseOut
		function onObjectMouseOut(e) {
			console.log('ObjectMouseOut: ' + e.detail.name);
			let feature = e.detail;
			feature.model.material.color = { r: 1, g: 0, b: 0 };

			feature.removeLabel();

			// popup.remove();
		}

		function createTooltip() {
			let popup = document.createElement('div');
			popup.style.width = '200px';
			popup.style.height = '300px';
			popup.style.backgroundColor = 'coral';
			popup.innerHTML = '<span style="font-size: 30px;color: black;">&#9762;</span>';
			console.log('popup html', popup);

			var tmp = document.createElement('div');
			tmp.appendChild(popup);
			console.log(tmp.innerHTML); // <p>Test</p>

			return tmp.innerHTML;
		}
	});

	// map update triggers
	// $: $mapView, updateView();
</script>

<div id="map" class="map" bind:this={mapRef} />

<style lang="scss">
	#map {
		width: 100%;
		height: 100%;
	}
</style>
