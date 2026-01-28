# Gosqas Interview Project

Hi! This is a color palette generator inspired by [Coolors](https://coolors.co). Generate random color palettes, lock colors you like, and save your favorites to a gallery :D

Made for GOSQAS Interview Meeting

## Tech Stack

- **Frontend:** Nuxt 4 (Vue 3) with TypeScript and Tailwind CSS
- **Backend:** Azure Functions v4 (Node.js)
- **Database:** Azure Data Tables 

## Getting Started

### Install Dependencies

```bash
# Install all workspace dependencies from root
npm install
```

### Run the App

**Terminal 1 - Start the Database (Azurite):**
```bash
npm run azurite
```

**Terminal 2 - Start the Backend:**
```bash
npm start
```

**Terminal 3 - Start the Frontend:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start making palettes!

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/palettes` | Fetch all saved palettes |
| POST | `/api/palettes` | Create a new palette |
| DELETE | `/api/palettes/{id}` | Delete a palette by ID |

## How to Use

- Hit **spacebar** or click the refresh button to generate new colors
- Click the **lock icon** on a color to keep it when regenerating
- Give your palette a name and click **Save** to add it to your gallery
- Hover over colors in the gallery to copy hex codes

## Testing

This project uses [Vitest](https://vitest.dev/) for testing!

```bash
# Run all tests
npm run test

```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run azurite` | Start Azure Table Storage  |
| `npm start` | Start the backend |
| `npm run dev` | Start the frontend |
| `npm run test` | Run tests |

## Notes

Getting Azurite to finally work was a journey...but I made it out alive!

The connection string setup and making sure the table storage was running on the right port took some trial and error. If you run into issues, make sure Azurite is running before starting the dev server!

( Maybe dev more to add to website )

### Future Implementations
- Complementary color generation
- Gradients generation
- Add/Remove # of colors in palette
- Type in HEX for color