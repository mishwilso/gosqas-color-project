# Gosqas Interview Project

Hi! This is a color palette generator inspired by [Coolors](https://coolors.co). Generate random color palettes, lock colors you like, and save your favorites to a gallery.

## Tech Stack

- **Frontend:** Nuxt 4 (Vue 3) with TypeScript and Tailwind CSS
- **Backend:** Nuxt Server API (H3)
- **Database:** Azure Data Tables (with Azurite for local development)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start the Database (Azurite)

You need Azurite running for the palette storage to work:

```bash
npm run azurite
```

This starts the Azure Table Storage emulator on port 10002. Data is stored locally in `./azurite-data/`.

### Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start generating palettes!

## How to Use

- Hit **spacebar** or click the refresh button to generate new colors
- Click the **lock icon** on a color to keep it when regenerating
- Give your palette a name and click **Save** to add it to your gallery
- Hover over colors in the gallery to copy hex codes

## Notes

Getting Azurite to finally work was a journey...but I made it alive!

The connection string setup and making sure the table storage emulator was running on the right port took some trial and error. If you run into issues, make sure Azurite is running before starting the dev server!
