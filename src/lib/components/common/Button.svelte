<script>
	export let handleClick = () => console.log('button clicked...');
</script>

<button on:click={() => handleClick()}>
	<div class="button-content-container">
		<slot>Default Button</slot>
	</div>
</button>

<style>
	.button-content-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
	}
</style>
