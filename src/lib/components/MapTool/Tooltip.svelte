<script>
	/* 
    Slightly odd approach here in order to allow us to place tooltip at 
    mouse location while using the mouseover events within the threebox 3D columns
    to control the visibility and content of the tooltip. 

    Basically:
      This component creates the tooltip and scaffolds the content within. It is positioned
      relative to the mouse location within the map-container div. 

      The mouseover function on the columns (see layer_housing.js) is responsible for 
      updating the opacity of this tooltip, as well as updating the contents of the 
      tooltip based on whichever station is current hovered
  */

	export let x = 0; // mouse location within map-container
	export let y = 0;

	let width = 250;
	let height;
	let viewportW, viewportH;
	let xOffset = 30;

	let top = 0;
	let left = 0;
	let arrowSide = 'left';

	//  position the tooltip based on location within viewport
	$: {
		if (x + xOffset + width > viewportW) {
			// left of mouse
			left = x - xOffset - width;
			arrowSide = 'arrow-right';
		} else {
			// right of mouse
			left = x + xOffset;
			arrowSide = 'arrow-left';
		}

		// top position
		top = y - height / 2;
	}
</script>

<svelte:window bind:innerWidth={viewportW} bind:innerHeight={viewportH} />

<div
	id="map-tooltip"
	bind:clientHeight={height}
	class={arrowSide}
	style:width={`${width}px`}
	style:top={`${top}px`}
	style:left={`${left}px`}
>
	<!-- Station Info -->
	<div class="station-mode">Station Mode</div>
	<div class="station-name">Temp Station</div>
	<div class="station-status">status: station status</div>

	<div class="spacer" />
	<!-- Reform Units -->
	<div class="units-container reform">
		<div class="n-units-container">
			<span class="n-units reform">999,999</span>
		</div>
		<span class="label reform"> possible units, if zoning reformed</span>
	</div>

	<!-- Baseline -->
	<div class="units-container current">
		<div class="n-units-container">
			<span class="n-units current">999,999</span>
		</div>
		<span class="label current"> possible units, with current zoning</span>
	</div>

	<div class="divider" />

	<!-- Existing -->
	<div class="units-container existing">
		<div class="n-units-container">
			<span class="n-units existing">9,999</span>
		</div>
		<span class="label existing"> existing units</span>
	</div>
</div>

<style lang="scss">
	#map-tooltip {
		position: absolute;
		background-color: white;
		padding: 15px;
		box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.15);
		z-index: 10;
		opacity: 0;
		transition: opacity 0.15s;
		border: solid 1px var(--color-gray);
	}

	// left facing arrow
	#map-tooltip.arrow-left {
		// arrow
		&:after {
			content: '';
			position: absolute;
			top: 50%;
			left: calc(0% - 20px);
			margin-top: -5px;
			border-style: solid;
			border-color: transparent #ffffff transparent transparent;
			border-width: 10px;
			transform: translate(0, -1px);
		}

		// arrow border
		&:before {
			content: '';
			position: absolute;
			top: 50%;
			left: calc(0% - 20px);
			margin-top: -5px;
			border-style: solid;
			border-color: transparent var(--color-gray) transparent transparent;
			border-width: 11px;
			transform: translate(-2px, -1px);
		}
	}

	// right facing arrow
	#map-tooltip.arrow-right {
		&:after {
			content: '';
			position: absolute;
			top: 50%;
			left: 100%;
			margin-top: -5px;
			border-style: solid;
			border-color: transparent transparent transparent #ffffff;
			border-width: 10px;
			transform: translate(0, -1px);
		}

		&:before {
			content: '';
			position: absolute;
			top: 50%;
			left: 100%;
			margin-top: -5px;
			border-style: solid;
			border-color: transparent transparent transparent var(--color-gray);
			border-width: 11px;
			transform: translate(1px, -1px);
		}
	}

	.station-mode {
		font-size: var(--text-sm);
		text-transform: uppercase;
	}

	.station-name {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		margin: 2px 0px;
	}

	.station-status {
		font-size: var(--text-sm);
		text-transform: lowercase;
		font-style: italic;
	}

	.spacer {
		height: 16px;
		width: 100%;
	}

	.units-container {
		width: 100%;
		display: flex;
		gap: 8px;
		margin: 8px 0px;
	}

	.n-units-container {
		width: 33%;
		text-align: right;
	}

	.n-units {
		align-self: flex-start;
		font-weight: var(--font-bold);
		text-align: right;
		border-bottom: solid 3px;

		&.reform {
			border-color: var(--color-yellow); // this can be overwritten by mouseover action
		}

		&.current {
			border-color: var(--color-gray-darkeset);
		}

		&.existing {
			border-color: var(--color-gray-dark);
		}
	}

	.label {
		width: 66%;
	}

	.divider {
		width: 100%;
		height: 2px;
		border-bottom: solid 1px var(--color-gray);
		margin: 10px 0px;
	}
</style>
