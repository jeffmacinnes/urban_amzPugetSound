#!/usr/bin/env bash

# make sure github repo is set to host pages from docs folder
# and svelte.config.js has 
#		adapter: adapter({
#			pages: 'docs',
#			assets: 'docs'
#		}),
npm run build
git add *
git commit -m "deploying to github pages"
git push origin main