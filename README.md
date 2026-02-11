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

### Data Preparation

Before running the API, you must scrape the data from Wikipedia. This will generate the necessary JSON files in the `dist/` directory.

```bash
bun run scrape
```

**Output:**

- `dist/schools.json`: Combined list of all schools (pretty).
- `dist/schools.min.json`: Combined list of all schools (minified).
- `dist/provinces/[province].json`: Individual JSON files for each province (pretty).
- `dist/provinces/[province].min.json`: Individual JSON files for each province (minified).

### Run API Server

Start the development server:

```bash
bun dev
```

The server will be running at `http://localhost:3000`.

#### API Endpoints

- `GET /schools`: Retrieve a list of schools.
  - Query Parameters:
    - `q`: Search by school name (optional).
    - `province`: Filter by province (optional).
  - Example: `GET /schools?province=ภูเก็ต`
- `GET /`: API Information.
- `GET /openapi`: OpenAPI documentation.

## Project Structure

- `src/index.ts`: API server entry point.
- `src/scripts/scrape.ts`: CLI script for scraping and saving data.
- `src/services/scraper.ts`: Scraper logic using Cheerio.
- `src/constants/provinces.ts`: List of Thai provinces.

## Automation

This project uses **GitHub Actions** to automatically update the school data.

- The workflow runs on the 1st of every 3rd month at midnight UTC.
- It executes the scraper and commits any changes to the `dist/` directory back to the repository.
- You can also manually trigger the "Update School Data" workflow from the Actions tab.
