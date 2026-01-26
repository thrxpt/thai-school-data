# Thai School Data Scraper & API

This project provides a tool to scrape Thai school information from Wikipedia and serve it via an API. It is built with [Bun](https://bun.sh), [ElysiaJS](https://elysiajs.com), and [Cheerio](https://cheerio.js.org).

## Features

- **Live Scraping**: Fetches up-to-date school data directly from Wikipedia.
- **REST API**: Serves school data via high-performance ElysiaJS endpoints.
- **Data Export**: Script to scrape and save all school data to JSON files.

## Prerequisites

- [Bun](https://bun.sh) runtime installed.

## Installation

```bash
bun install
```

## Usage

### Run API Server

Start the development server:

```bash
bun dev
```

The server will be running at `http://localhost:3000`.

#### API Endpoints

- `GET /list`: Retrieve a list of schools for **all** provinces. (Note: This performs multiple requests and may take time).
- `GET /list/:province`: Retrieve schools for a specific province.
  - Example: `GET /list/ภูเก็ต`
- `GET /ping`: Health check.
- `GET /swagger`: OpenAPI documentation (default Elysia Swagger path).

### Run Scraper Script

To scrape all data and save it locally to the `dist/` directory:

```bash
bun run scrape
```

**Output:**

- `dist/schools.json`: Combined list of all schools (pretty).
- `dist/schools.min.json`: Combined list of all schools (minified).
- `dist/provinces/[province].json`: Individual JSON files for each province (pretty).
- `dist/provinces/[province].min.json`: Individual JSON files for each province (minified).

## Project Structure

- `src/index.ts`: API server entry point.
- `src/scripts/scrape.ts`: CLI script for scraping and saving data.
- `src/services/scraper.ts`: Scraper logic using Cheerio.
- `src/constants/provinces.ts`: List of Thai provinces.

## Automation

This project uses **GitHub Actions** to automatically update the school data.

- The workflow runs daily at midnight UTC.
- It executes the scraper and commits any changes to the `dist/` directory back to the repository.
- You can also manually trigger the "Update School Data" workflow from the Actions tab.
