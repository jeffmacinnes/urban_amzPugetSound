<script>
	import bg from '$assets/bg.jpg';
	import bgOverlay from '$assets/bg_overlay.png';
	import train from '$assets/train.svg';
	import { gsap } from 'gsap';
	import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
	import { MotionPathHelper } from 'gsap/MotionPathHelper';
	import { onMount } from 'svelte';

	export let viewportDims = [0, 0];
	export let flyTo = [0.5, 0.5]; // as proportion
	export let scale = 1;

	const cityDims = [1728, 1728];

	let transform = `translate(0px, 0px)`;
	$: {
		let x = -(flyTo[0] * cityDims[0]) + viewportDims[0] / 2; // add half of viewport dim to center in viewport
		let y = -(flyTo[1] * cityDims[1]) + viewportDims[1] / 2;
		transform = `translate(${x}px, ${y}px) scale(${scale})`;
	}

	onMount(() => {
		gsap.registerPlugin(MotionPathPlugin, MotionPathHelper);

		gsap.to('#train', {
			motionPath: {
				path: 'M-1084.25,-540.243 C-980.347,-519.243 393.978,-131.235 409.99,-114.249 425.978,-99.231 1353.887,154.127 1495.589,188.311 ',
				alignOrigin: [0.5, 0.5],
				autoRotate: false
			},
			duration: 15,
			ease: 'none',
			repeat: -1
		});

		// MotionPathHelper.create('#train');
	});
</script>

<div class="bg-container" style:transform>
	<img id="bg" src={bg} alt="" />
	<img id="train" src={train} alt="" />
	<img id="bg-overlay" src={bgOverlay} alt="" />
	<div id="midpt" />
</div>

<style>
	.bg-container {
		position: relative;
		border: solid 1px red;
		width: 1728px;
		height: 1728px;
		max-width: 1728px;
		max-height: 1728px;
		overflow: hidden;
	}

	#midpt {
		position: absolute;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		top: 50%;
		left: 50%;
		background-color: red;
	}

	#bg-overlay {
		position: absolute;
		top: 0;
		left: 0;
	}

	#train {
		position: absolute;
		top: 50%;
		left: 50%;
	}

	#bg {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
