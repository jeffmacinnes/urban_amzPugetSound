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
	import Dropdown from './Dropdown.svelte';

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

	$: console.log('current options', $jurisdiction, $demographic, $stationType, $reformType);
</script>

<div class="options-container">
	<!-- JURISDICTION -->
	<Dropdown
		options={$jurisdictionOpts}
		currentValue={$jurisdiction}
		on:update={(e) => handleUpdate('jurisdiction', e)}
	/>
	<!-- DEMOGRAPHICS -->
	<Dropdown
		options={$demographicOpts}
		currentValue={$demographic}
		on:update={(e) => handleUpdate('demographic', e)}
	/>
	<!-- STATION TYPE -->
	<Dropdown
		options={$stationTypeOpts}
		currentValue={$stationType}
		on:update={(e) => handleUpdate('stationType', e)}
	/>
	<!-- REFORM TYPE -->
	<Dropdown
		options={$reformTypeOpts}
		currentValue={$reformType}
		on:update={(e) => handleUpdate('reformType', e)}
	/>
</div>

<style lang="scss">
	.options-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 40px;
	}
</style>
