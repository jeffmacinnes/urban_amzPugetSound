import { sveltekit } from '@sveltejs/kit/vite';
import dsv from '@rollup/plugin-dsv';
import commonjs from 'vite-plugin-commonjs';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), dsv(), commonjs()],
	ssr: {
		noExternal: ['gsap']
	}
};

export default config;
