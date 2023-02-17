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
		{
			name: 'Jurisdiction',
			currentValue: $jurisdictionOpts.find((d) => d.display === 'Seattle'),
			opts: $jurisdictionOpts
		},
		{
			name: 'Demographic',
			currentValue: $demographicOpts.find((d) => d.display === 'Population Density'),
			opts: $demographicOpts
		},
		{
			name: 'Station',
			currentValue: $stationTypeOpts.find((d) => d.display === 'All'),
			opts: $stationTypeOpts
		},
		{
			name: 'Reform',
			currentValue: $reformTypeOpts.find((d) => d.display === 'None'),
			opts: $reformTypeOpts
		}
	];

	const handleSelection = (name) => {
		let thisControl = controls.find((d) => d.name === name);
		let value = thisControl.currentValue;
		if (name === 'Jurisdiction') {
			jurisdiction.set(value.JURISDICTION_ID);
		} else if (name === 'Demographic') {
			demographic.set(value.key);
		} else if (name === 'Station') {
			stationType.set(value.key);
		} else if (name === 'Reform') {
			reformType.set(value.key);
		}
	};

	$: console.log('currentOpts', $jurisdiction, $demographic, $stationType, $reformType);
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
