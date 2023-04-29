# Urban Institute - Amazon Puget Sound Housing project

## Data

Original source data is in `data/raw/`.

Original data is prepped/processed using scripts in `scripts/` dir.

The processed geojson files get stored in `data/geo` and hosted via the github repo. The live site fetches these files as needed from github.

The processed csv files get stored in `src/lib/data` where they can be ingested by the site.

All data used locally by the site is found in `src/lib/data`

## Developing

The site is built using Svelte, and the project scaffolding borrows heavily from the terrific https://github.com/the-pudding/svelte-starter. Project files are `src/` directory.

To install dependencies:

```bash
npm i
```

To run the development server

```bash
npm run dev
```

## Deploy

The staging site is hosted via Netlify. Pushes to the `main` branch are setup to automatically trigger builds and deployment via Netlify.

### Env Variables

The uses a private tokens for services like Mapbox. All private tokens are stored in a local `.env` file in the root of the repository (see `.env.example` for how to structure it). **However, the `.env` file is NOT stored in the repository**.

- When working locall: Make your own `.env` file, with the same variable as `.env.example`. Do not track this file in git.
- To access env vars within Netlify deployment environment:
  - Use Netlify CLI to link local repo to netlify (once Netlify has been set up to monitor this remote repo): `netlify link`
  - Use Netlify CLI to import the .env file: `netlify env:import .env`
  - **This step must be repeated whenever you make changes to the `.env` file**
