<script>
	import Options from '$components/ToolTest/Options.svelte';
	import Map from '$components/ToolTest/Map.svelte';
</script>

<div class="wrapper">
	<Options />
	<Map />
</div>

<style lang="scss">
	.wrapper {
		height: 100vh;
		width: 100vw;
		border: solid 1px red;
	}
</style>
