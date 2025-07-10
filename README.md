# Cybersecurity Portal (Next.js)

This project is a Next.js v15 application for a cybersecurity news portal.

## Prerequisites

- Node.js 18 or later
- npm (recommended) or pnpm

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   (If you prefer `pnpm`, run `pnpm install`.)
2. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   Set `NEXT_PUBLIC_API_BASE_URL` to the URL of your backend API. Optionally set `NEXT_PUBLIC_PROCEDURES_API_BASE_URL`.

## Development

Start the development server with hot reloading:

```bash
npm run dev
```

## Building and Running

To create a production build and start the server:

```bash
npm run build
npm run start
```

This starts the Next.js server from the `.next` directory. When deploying to IIS you can run this server via [iisnode](https://github.com/Azure/iisnode) or behind a reverse proxy.

## Static Export

Next.js supports exporting to a purely static site by setting `output: 'export'` in `next.config.mjs`. Because this project uses many dynamic routes, you would also need to implement `generateStaticParams` for each dynamic page. Without those implementations the build will fail. If all dynamic routes are handled, running `npm run build` will generate an `out/` folder which can be hosted as static files.

