import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$actions/*': './src/lib/actions/*',
			'$assets/*': './src/lib/assets/*',
			'$components/*': './src/lib/components/*',
			'$data/*': './src/lib/data/*',
			'$stores/*': './src/lib/stores/*',
			'$styles/*': './src/lib/styles/*',
			'$utils/*': './src/lib/utils/*'
		}
	}
};

export default config;
