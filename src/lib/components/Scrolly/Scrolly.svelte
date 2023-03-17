<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import { getSteps } from './steps.js';

	export let scrollContent;

	const steps = getSteps(scrollContent);

	let stepProgress, scrollerProgress; // renamed for clarity
	let index = 0;
	$: activeStep = steps[index];

	let bgContainerW, bgContainerH;

	// $: console.log('activeStep', activeStep);
</script>

<div class="scroll-container">
	<Scroller bind:index bind:offset={stepProgress} bind:progress={scrollerProgress}>
		<div
			slot="background"
			class="scroll-background"
			bind:clientWidth={bgContainerW}
			bind:clientHeight={bgContainerH}
		>
			<!-- BG ILLUSTRATION LAYER-->
			<div class="bg-layer">
				<svelte:component
					this={activeStep.bgCmp}
					containerDims={[bgContainerW, bgContainerH]}
					{...activeStep.bgProps}
				/>
			</div>
		</div>

		<div slot="foreground" class="scroll-foreground">
			<div class="spacer" />

			<!-- SCROLLING FOREGROUND LAYER -->
			{#each steps as step}
				<section class="fg-step">
					<svelte:component this={step.fgCmp} {...step.fgProps} />
				</section>
			{/each}
			<div class="spacer" />
		</div>
	</Scroller>
</div>

<style lang="scss">
	.scroll-container {
		width: 100%;
		margin-top: 4rem;
	}

	// If you want to catch cursor interactions on the BG layer
	// [slot='background'] {
	// 	pointer-events: all;
	// }
	// [slot='foreground'] {
	// 	pointer-events: none;
	// }

	.scroll-background {
		width: 100%;
		max-width: 1200px;
		margin: 100px auto;
		height: 100vh;
	}

	.fg-step {
		// border: solid 1px red;
		min-height: 100vh;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20vh 0;
		pointer-events: none;

		&:first-of-type {
			margin-top: 0;
		}

		&:last-of-type {
			margin-bottom: 0;
		}
	}

	.spacer {
		height: 100vh;
	}
</style>
