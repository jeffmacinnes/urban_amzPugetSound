<script>
	import logo from '$lib/images/DecimalPointLogo.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="bg-image">
		<img src={logo} alt="" />
	</div>
	<h1>SvelteKit Template for Decimal Point</h1>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	.bg-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	h1 {
		width: 100%;
	}
</style>
