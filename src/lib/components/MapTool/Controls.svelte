<script>
	import { slide, fade } from 'svelte/transition';
	import controlsIcon from '$assets/icon_controls.svg';
	import closeIcon from '$assets/icon_close.svg';
	import {
		jurisdiction,
		jurisdictionOpts,
		demographic,
		demographicOpts,
		stationType,
		stationTypeOpts,
		reformType,
		reformTypeOpts,
		housingEstimates,
		demographicLayerData,
		demographicLayerLegend
	} from '$stores/siteData';
	import Dropdown from './Dropdown.svelte';
	import LegendQuantile from './LegendQuantile.svelte';

	const handleUpdate = (name, e) => {
		let newValue = e.detail.value;
		if (name === 'jurisdiction') {
			jurisdiction.set(newValue);
		} else if (name === 'demographic') {
			demographic.set(newValue);
		} else if (name === 'stationType') {
			stationType.set(newValue);
		} else if (name === 'reformType') {
			reformType.set(newValue);
		} else {
			console.log('unrecognized dropdown name: ', name);
		}
	};

	// $: console.log(
	// 	'current options',
	// 	$jurisdiction,
	// 	$demographic,
	// 	$demographicLayerData,
	// 	$stationType,
	// 	$reformType,
	// 	$housingEstimates
	// );

	let open = true;
	let duration = 300;

	// -- construct reform sentence parts
	$: reformDiffEstimate = $housingEstimates.reformOverBaseline.toLocaleString('en-US');
	$: baselineEstimate = $housingEstimates.baselineTotal.toLocaleString('en-US');
	$: existingEstimate = $housingEstimates.existing.toLocaleString('en-US');
	$: jurisdictionName = $jurisdictionOpts.find((d) => d.key === $jurisdiction).display;

	let reformMsgA, reformMsgB, reformMsgC, reformMsgD;
	$: reformMsgA = ` currently has <span class="existing-value">${existingEstimate} housing units</span> within a half mile of transit.`;
	$: if ($reformType === 'all_reforms') {
		// i.e. "Enacted all"
		reformMsgB = 'If policymakers ';
		reformMsgC = ' zoning changes, ';
	} else if ($reformType === 'baseline_under_zoning') {
		// i.e. "No Zoning Changes"
		reformMsgB = 'If policymakers enact ';
		reformMsgC = ', ';
	} else {
		reformMsgB = 'If policymakers enacted the ';
		reformMsgC = ' zoning change, ';
	}
	$: reformMsgD = `<span class="reform-value">${reformDiffEstimate}</span> units would be added to the existing maximum of <span class="current-value">${baselineEstimate}</span> under current zoning.`;
</script>

<div class="controls-container">
	{#if !open}
		<!-- CLOSED CONTROLS -->
		<div
			class="controls-closed"
			in:fade={{ delay: duration }}
			on:click={() => (open = !open)}
			on:keypress={() => (open = !open)}
		>
			Controls<img src={controlsIcon} alt="" />
		</div>
	{:else}
		<!-- OPEN CONTROLS -->
		<div class="controls-open" transition:slide={{ duration }}>
			<div class="close-button">
				<img
					src={closeIcon}
					style:width={'24px'}
					on:click={() => (open = !open)}
					on:keypress={() => (open = !open)}
					alt=""
				/>
			</div>

			<!-- Reform controls -->
			<div class="reform-controls control-section">
				<Dropdown
					options={$jurisdictionOpts}
					currentValue={$jurisdiction}
					on:update={(e) => handleUpdate('jurisdiction', e)}
				/>
				{@html reformMsgA}
				<br />
				{@html reformMsgB}
				<Dropdown
					options={$reformTypeOpts}
					currentValue={$reformType}
					on:update={(e) => handleUpdate('reformType', e)}
				/>
				{@html reformMsgC}
				{@html reformMsgD}
			</div>

			<!-- Transit controls -->
			<div class="transit-controls control-section">
				<Dropdown
					options={$stationTypeOpts}
					currentValue={$stationType}
					on:update={(e) => handleUpdate('stationType', e)}
				/>
			</div>

			<!-- Demographic controls -->
			<div class="demographic-controls control-section">
				<Dropdown
					style="white"
					options={$demographicOpts}
					currentValue={$demographic}
					on:update={(e) => handleUpdate('demographic', e)}
				/>
				<div class="legend-container">
					<LegendQuantile legendProps={$demographicLayerLegend} width={265} height={60} />
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.controls-container {
		z-index: 100;
	}

	.controls-open {
		width: 350px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		background-color: white;
		border: solid 1px var(--color-gray-darkest);
	}

	.close-button {
		width: 100%;
		display: flex;
		justify-content: flex-end;

		img {
			cursor: pointer;
		}
	}

	.control-section {
		padding: 16px 0;
		border-bottom: solid 1px var(--color-gray);
		font-size: var(--text-xl);
		font-weight: var(--font-normal);
		line-height: 1.8;

		:global(span) {
			font-weight: var(--font-bold);
			white-space: nowrap;
		}

		:global(span.existing-value) {
			border-bottom: solid 3px var(--color-gray);
		}

		:global(span.current-value) {
			border-bottom: solid 3px var(--color-gray-darkest);
		}

		:global(span.reform-value) {
			border-bottom: solid 3px var(--color-yellow);
		}

		&:last-of-type {
			border-bottom: none;
		}
	}

	.controls-closed {
		width: 160px;
		height: 50px;
		padding: 8px 11px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		line-height: var(--leading-none);
		text-transform: uppercase;
		color: var(--color-white);
		background-color: var(--color-gray-darkest);
		cursor: pointer;

		img {
			width: 30px;
			height: 30px;
		}
	}
</style>
