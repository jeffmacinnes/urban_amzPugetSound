<script>
	import Main from '$components/Main.svelte';
	import { MAPBOX_API_KEY } from '$stores/siteData';

	export let data; // data object loaded from +page.server.js;

	if (data.MAPBOX_API_KEY) {
		MAPBOX_API_KEY.set(data.MAPBOX_API_KEY);
	}
</script>

<svelte:head>
	<title>Urban - Amz Puget Sound</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Main />
</section>

<style>
	h1 {
		width: 100%;
	}
</style>
