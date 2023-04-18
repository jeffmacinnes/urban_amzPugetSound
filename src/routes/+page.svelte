<script>
	import Main from '$components/Main.svelte';
	import Meta from '$components/Meta.svelte';
	import { MAPBOX_API_KEY } from '$stores/siteData';

	export let data; // data object loaded from +page.server.js;

	if (data.MAPBOX_API_KEY) {
		MAPBOX_API_KEY.set(data.MAPBOX_API_KEY);
	}
</script>

<Meta
	title="Room for All"
	description="Addressing the Affordable Housing Shortage Through Zoning Changes"
	url=""
/>
<section>
	<Main />
</section>

<style>
	h1 {
		width: 100%;
	}
</style>
