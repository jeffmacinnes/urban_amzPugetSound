<script>
	import siteCopy from '$data/siteCopy.json';

	import Header from '$components/Header/Header.svelte';
	import Hero from '$components/Hero/Hero.svelte';
	import TextBlocks from '$components/common/TextBlocks.svelte';
	import Scrolly from '$components/Scrolly/Scrolly.svelte';
	import About from '$components/About/About.svelte';
	import ProjectCredits from '$components/ProjectCredits/ProjectCredits.svelte';
	import MapTool from '$components/MapTool/MapTool.svelte';

	let debug = false;
</script>

{#if debug}
	<!-- <section class="reforms-overview">
		<Scrolly scrollContent={siteCopy.scrolly} />
	</section> -->
	<section class="map-tool">
		<MapTool content={siteCopy.map} />
	</section>
{:else}
	<!-- Hero -->
	<Hero text={siteCopy.hero} />

	<!-- Intro -->
	<section class="intro">
		<TextBlocks blocks={siteCopy.intro} />
	</section>

	<!-- Scrolly -->
	<section class="reforms-overview">
		<Scrolly scrollContent={siteCopy.scrolly} />
	</section>

	<!-- Body -->
	<section class="body">
		<TextBlocks blocks={siteCopy.body} />
	</section>

	<!-- Tool -->
	<section class="map-tool">
		<MapTool content={siteCopy.map} />
	</section>

	<!-- About -->
	<section class="about">
		<About content={siteCopy.about} />
	</section>

	<!-- Credits -->
	<section class="credits">
		<ProjectCredits content={siteCopy.projectCredits} />
	</section>

	<!-- <Dummy /> -->
	<div class="spacer" />
{/if}

<!-- <ToolTest /> -->
<style lang="scss">
	section {
		margin-top: 6rem;
	}

	.spacer {
		height: 200px;
	}
</style>
