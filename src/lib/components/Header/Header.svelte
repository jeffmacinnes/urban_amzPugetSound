<script>
	import UrbanLogo from '$assets/urban-logo-badge-color.svg';
</script>

<header>
	<a href="https://www.urban.org"><img src={UrbanLogo} alt="" /></a>
	<a href="https://www.urban.org/feature-stories-data-blogs">Stories and data tools</a>
</header>

<style lang="scss">
	header {
		position: fixed;
		top: 0;
		width: 100%;
		padding: 16px 24px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 36px;
		background-color: var(--color-white);
		border-bottom: solid 1px var(--color-gray);
		z-index: 10;
	}

	img {
		width: 32px;
	}

	a {
		font-size: var(--text-2xl);
		font-weight: var(--font-light);
		color: var(--color-gray-darker);
	}
</style>
