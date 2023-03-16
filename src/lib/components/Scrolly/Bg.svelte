<script>
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	import PlexifyImg from '$assets/reformIllustrations/Plexify.webp';
	import MissingMiddleImg from '$assets/reformIllustrations/MissingMiddle.webp';
	import MultiplyImg from '$assets/reformIllustrations/Multiply.webp';
	import LegalizeImg from '$assets/reformIllustrations/Legalize.webp';
	import TestBg from '$assets/TestBg.png';

	import Annotation from './Annotation.svelte';

	export let containerDims = []; // dims for the container holding the fixed bg layer
	export let reformImg = null; //
	export let flyTo = [0.5, 0.5]; // as proportion
	export let scale = 1;
	export let annotations = [];
	export let overlay = null;

	// --- Setup BG Image
	let bgImg;
	$: if (reformImg === 'Plexify') {
		bgImg = PlexifyImg;
	} else if (reformImg === 'Missing Middle') {
		bgImg = MissingMiddleImg;
	} else if (reformImg === 'Multiply') {
		bgImg = MultiplyImg;
	} else if (reformImg === 'Legalize') {
		bgImg = LegalizeImg;
	} else {
		bgImg = LegalizeImg; // Default Img
	}

	// --- Camera position and tweens --------------------------
	let imgDims = [1600, 1600]; // each reform image is 1600 x 1600;
	const flyToTween = tweened(flyTo, {
		delay: 0,
		duration: 1500,
		easing: cubicInOut
	});

	const scaleTween = tweened(scale, {
		delay: 0,
		duration: 1500,
		easing: cubicInOut
	});

	$: if (flyTo) {
		flyToTween.set(flyTo);
	}
	$: if (scale) {
		scaleTween.set(scale);
	}

	let transform = `translate(0px, 0px)`;
	$: {
		/* Construct the transform to zoom and center the bgImg at the target location
		NOTE: you must have transform-origin set to 0,0 on the imgContainer for this to work
		Steps:
			1. Translate so target is at origin (top left corner, [0,0])
			2. Apply scale. Image will be scaled with target still at origin. 
			3. Translate target to center of container (i.e. translate it right half of the container width and down half container height)
		*/
		let targetX = $flyToTween[0] * imgDims[0];
		let targetY = $flyToTween[1] * imgDims[1];

		// zoom transform
		let setOriginToTarget = `translate(-${targetX}px, -${targetY}px)`; // set the origin to the target location
		let scale = `scale(${$scaleTween})`;

		// center in container
		let center = `translate(${containerDims[0] / 2}px, ${containerDims[1] / 2}px)`;

		// combine transforms. NOTE: Transforms applied from RIGHT to LEFT!
		transform = `${center} ${scale} ${setOriginToTarget}`;
	}

	// --- Annotations setup ----------------------------------
	$: annotationScale = 1 / scale; // annotation scale should be inverse of img scale
	$: annotations = annotations.map((d, i) => ({
		// convert coordinates from normalized to pixels
		coordinates: [d.location[0] * imgDims[0], d.location[1] * imgDims[1]],
		...d
	}));

	$: showMask = overlay === null;

	$: console.log(containerDims);
</script>

<div class="bg-container" style:height={`${containerDims[1]}px`}>
	<!-- Background image and annotations -->
	<div class="img-container" style:transform>
		<img src={bgImg} alt="" />

		{#each annotations as annotation (annotation.id)}
			<Annotation
				text={annotation.text}
				coordinates={annotation.coordinates}
				scale={annotationScale}
			/>
		{/each}
	</div>

	<!-- Put transluscent white mask over bg image when no overlay-->
	{#if showMask}
		<div transition:fade class="mask" />
	{/if}

	<!-- Overlay containing info about the current reform -->
	{#if overlay}
		<div transition:fade class="overlay">
			<div class="overlay-content">
				<h2>{overlay.name}</h2>
				<p>{overlay.overview}</p>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.bg-container {
		width: 100%;
		max-height: 800px;
		// border: solid 1px green;
		overflow: hidden;
		position: relative;
	}

	.img-container {
		position: relative;
		transform-origin: 0px 0px;
		background-color: white;
	}

	img {
		position: absolute;
	}

	.annotation-wrapper {
		position: absolute;
	}

	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.7);
	}

	.overlay {
		position: absolute;
		width: 33%;
		height: 100%;
		padding: 40px 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		background-color: var(--color-blue-dark);
	}

	.overlay-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}
</style>
