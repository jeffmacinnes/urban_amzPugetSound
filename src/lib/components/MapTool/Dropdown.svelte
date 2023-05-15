<script>
	import { createEventDispatcher } from 'svelte';
	import Chevron from '$assets/icon_chevron-down.svg';
	import DropdownArrow from '$assets/icon_dropdown.svg';

	export let options = []; // each item like { key: keyName, display: 'key name'}
	export let currentValue = null; // the "key" prop of the option you want selected
	export let style = 'blue';

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
		{#if style === 'blue'}
			<select
				class={style}
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
		{:else}
			<select
				class={style}
				bind:this={ref}
				value={currentValue}
				on:change={(e) => handleSelection(e)}
				style:background-image={`url(${DropdownArrow})`}
			>
				{#each options as opt}
					<option value={opt.key}>
						{opt.display}
					</option>
				{/each}
			</select>
		{/if}
	</form>
</div>

<style lang="scss">
	.dropdown-container {
		display: inline-block;
	}

	select.blue {
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
		cursor: pointer;

		&:focus {
			border-radius: 0px;
			outline: none;
		}
	}

	select.white {
		width: 105%;
		padding: 4px;
		padding-left: 0px;
		margin: 4px;
		margin-left: 0px;
		margin-bottom: 8px;
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		line-height: var(--leading-normal);
		color: var(--color-black);
		background-color: var(--color-white);
		border: none;
		-webkit-appearance: none;
		appearance: none;
		background-position: right 0px center;
		background-repeat: no-repeat;
		background-size: auto 33%;
		cursor: pointer;
		// outline: solid 1px red;

		&:focus {
			border-radius: 0px;
			outline: none;
		}
	}
</style>
