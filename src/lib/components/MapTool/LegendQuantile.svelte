<script>
	import { color } from '$data/variables.json';

	export let legendProps;
	export let width = 320;
	export let height = 50;
	export let margin = { top: 15, right: 0, bottom: 15, left: 0 };

	$: ({ colorScale, title, tickVals } = legendProps);
	$: console.log('here', tickVals);
</script>

<svg viewBox={`0 0 ${width} ${height}`}>
	<!-- {#each colorScale.range() as color, i}
		<rect
			x={x(i - 1)}
			y={margin.top}
			width={x(i) - x(i - 1)}
			height={height - margin.top - margin.bottom}
			fill={color}
		/>
	{/each} -->
</svg>

<style>
	svg {
		display: block;
		overflow: 'visible';
	}

	.tick-label {
		fill: var(--color-black);
		font-size: 10px;
		font-weight: 500;
	}

	.title {
		text-transform: uppercase;
		font-size: 10px;
		font-weight: 500;
		fill: var(--color-black);
	}
</style>
