# Property Marketplace Frontend

React + Vite + TypeScript frontend for a property listing marketplace connected to the .NET API gateway.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local environment:

   ```bash
   cp .env.example .env
   ```

3. Confirm the backend gateway is running:

   ```bash
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

The app opens at `http://127.0.0.1:3000`.

## Architecture

- `src/config`: central environment, routes, endpoints, navigation, filters, auth, and media defaults.
- `src/api`: typed HTTP client and backend error helpers.
- `src/features`: listings, auth, profile, and inquiry workflows.
- `src/components`: shared UI primitives and application-level components.
- `src/layouts`: public layout and route protection.
- `src/types`: shared marketplace DTOs and domain types.

All backend calls go through the API gateway configured by `VITE_API_BASE_URL`.
