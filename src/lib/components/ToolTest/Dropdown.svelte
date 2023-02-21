<script>
	import { createEventDispatcher } from 'svelte';

	export let options = []; // each item like { key: keyName, display: 'key name'}
	export let currentValue = null; // the "key" prop of the option you want selected

	let ref;
	const dispatch = createEventDispatcher();
	const handleSelection = (e) => {
		// emit the "key" prop of selected option
		let value = options[ref.selectedIndex].key;
		dispatch('update', {
			value
		});
	};
</script>

<div class="dropdown-container">
	<form>
		<select id="test" bind:this={ref} value={currentValue} on:change={(e) => handleSelection(e)}>
			{#each options as opt}
				<option value={opt.key}>
					{opt.display}
				</option>
			{/each}
		</select>
	</form>
</div>
