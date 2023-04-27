<script>
	export let textBlocks = [];
</script>

<div class="textblock-container">
	{#each textBlocks as textBlock}
		<div class="text-block">
			<p>{@html textBlock.value}</p>
		</div>
	{/each}
</div>

<style lang="scss">
	.textblock-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 66%;
		max-width: 600px;
		padding: 48px 54px;
		border: solid 1px var(--color-gray);
		background-color: white;
		box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.15);
	}

	@media screen and (max-width: 768px) {
		.textblock-container {
			width: 90%;
		}
	}

	@media screen and (max-width: 400px) {
		.textblock-container {
			padding: 48px 30px;
		}
	}
</style>
