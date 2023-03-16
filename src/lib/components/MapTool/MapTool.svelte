<script>
	import OptionsTest from './OptionsTest.svelte';
	import Map from './Map.svelte';
	import Controls from './Controls.svelte';
</script>

<div class="map-tool-wrapper">
	<Map />
	<div class="controls-wrapper">
		<Controls />
	</div>
</div>

<style lang="scss">
	.map-tool-wrapper {
		position: relative;
		height: 75vh;
		width: 100%;
		// border: solid 1px red;
	}

	.controls-wrapper {
		position: absolute;
		right: 30px;
		top: 30px;
	}
</style>
