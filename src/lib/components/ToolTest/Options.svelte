<script>
	import {
		jurisdiction,
		jurisdictionOpts,
		demographic,
		demographicOpts,
		stationType,
		stationTypeOpts,
		reformType,
		reformTypeOpts
	} from '$stores/siteData';

	let controls = [
		{ name: 'jurisdiction', currentValue: '', opts: $jurisdictionOpts },
		{ name: 'demographic', currentValue: '', opts: $demographicOpts },
		{ name: 'station', currentValue: '', opts: $stationTypeOpts },
		{ name: 'reform', currentValue: '', opts: $reformTypeOpts }
	];

	const handleSelection = (name) => {
		let thisControl = controls.find((d) => d.name === name);
		let value = thisControl.currentValue;
		if (name === 'jurisdiction') {
			jurisdiction.set(value.JURISDICTION_ID);
		} else if (name === 'demographic') {
			demographic.set(value.key);
		} else if (name === 'station') {
			stationType.set(value.key);
		} else if (name === 'reform') {
			reformType.set(value.key);
		}
	};

	$: console.log('here', $jurisdiction, $demographic, $stationType, $reformType);
</script>

<div class="controls-container">
	<form>
		{#each controls as control}
			<select bind:value={control.currentValue} on:change={() => handleSelection(control.name)}>
				<option value="" selected disabled>{control.name}</option>
				{#each control.opts as opt}
					<option value={opt}>
						{opt.display}
					</option>
				{/each}
			</select>
		{/each}
	</form>
</div>

<style lang="scss">
	.controls-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
	}

	select {
		height: 20px;
	}
</style>
