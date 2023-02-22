import adapter from '@sveltejs/adapter-auto';
import autoprefixer from 'autoprefixer';
import preprocess from 'svelte-preprocess';
import dsv from '@rollup/plugin-dsv';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: {
			plugins: [autoprefixer]
		}
	}),
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs'
		}),
		alias: {
			'$actions/*': './src/lib/actions/*',
			'$assets/*': './src/lib/assets/*',
			'$components/*': './src/lib/components/*',
			'$data/*': './src/lib/data/*',
			'$stores/*': './src/lib/stores/*',
			'$styles/*': './src/lib/styles/*',
			'$utils/*': './src/lib/utils/*'
		}
	},
	plugins: [dsv()]
};

export default config;
