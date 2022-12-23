<script>
	import Background from './Background.svelte';

	let viewportW = 1000;
	let viewportH = 1000;
</script>

<div class="container">
	<div class="viewport" style:width={`${viewportW}px`} style:height={`${viewportH}px`}>
		<Background viewportDims={[viewportW, viewportH]} flyTo={[0.5, 0.5]} scale={0.4} />
	</div>
</div>

<style lang="scss">
	.container {
		width: 100vw;
		display: flex;
		justify-content: center;
	}

	.viewport {
		overflow: hidden;
		border: solid 1px blue;
	}
</style>
