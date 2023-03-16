<script>
	import { createEventDispatcher } from 'svelte';
	import Chevron from '$assets/icon_chevron-down.svg';

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
		<select
			id="test"
			bind:this={ref}
			value={currentValue}
			on:change={(e) => handleSelection(e)}
			style:background-image={`url(${Chevron})`}
		>
			{#each options as opt}
				<option value={opt.key}>
					{opt.display}
				</option>
			{/each}
		</select>
	</form>
</div>

<style lang="scss">
	.dropdown-container {
		display: inline-block;
	}

	select {
		padding: 4px;
		padding-left: 10px;
		padding-right: 30px;
		margin: 4px;
		font-size: var(--text-xl);
		font-weight: var(--font-normal);
		line-height: var(--leading-relaxed);
		color: var(--color-white);
		background-color: var(--color-blue);
		border: none;
		-webkit-appearance: none;
		appearance: none;
		background-position: right 8px center;
		background-repeat: no-repeat;
		background-size: auto 33%;

		&:focus {
			border-radius: 0px;
			outline: none;
		}

		&:after {
			position: absolute;
			content: '';
			top: 14px;
			right: 10px;
			width: 0;
			height: 0;
			border: 6px solid transparent;
			border-color: #fff transparent transparent transparent;
		}
	}
</style>
