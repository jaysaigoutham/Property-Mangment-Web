# Property Marketplace Frontend

React + Vite + TypeScript frontend for a property listing marketplace connected to the existing .NET API gateway.

The app currently supports:

- Property search and filtering
- Property grid cards
- Property details with media, location, amenities, and agent contact details
- Buyer/agent registration
- Login, logout, protected profile page, and JWT bearer auth
- Inquiry form and "My inquiries" page for authenticated users

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Confirm `.env` points to the backend gateway:

   ```bash
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open:

   ```text
   http://127.0.0.1:3000
   ```

## Scripts

```bash
npm run dev      # Start local Vite dev server on 127.0.0.1:3000
npm run build    # TypeScript build + Vite production build
npm run preview  # Preview production build locally
```

## Backend Dependency

All normal frontend API calls go through the gateway configured in `VITE_API_BASE_URL`.

Default:

```text
http://localhost:8080
```

Do not call service-specific ports from UI code. If a backend endpoint path changes, update the endpoint builder in `src/config/api-endpoints.ts`.

## Architecture

The project is intentionally split by responsibility so junior developers know where changes belong.

```text
src/
  api/          Shared HTTP client, backend error handling, response helpers
  components/   Reusable UI components used across features
  config/       Central app configuration
  features/     Product feature modules
  layouts/      App shell and protected route handling
  types/        Shared DTOs and domain types
```

### `src/config`

This is the central location for app-wide configuration.

- `env.ts`: reads `VITE_API_BASE_URL`
- `api-endpoints.ts`: backend endpoint paths and endpoint builder functions
- `routes.ts`: frontend route paths and route builder functions
- `navigation.ts`: public/authenticated navigation links and branding
- `filters.ts`: listing filter defaults and option lists
- `auth.ts`: token storage keys, auth route settings, and role labels
- `media.ts`: fallback property images

Rule: avoid hardcoding route paths, endpoint paths, token keys, or filter options inside feature components. Put those values in `src/config`.

### `src/api`

Use this layer for all backend communication.

- `http-client.ts` builds API URLs from `env.apiBaseUrl`, attaches `Authorization: Bearer <token>`, handles JSON bodies, redirects on `401`, and routes protected `403` responses to `/not-authorized`.
- `errors.ts` normalizes API errors for UI messages.
- `response.ts` contains tolerant response helpers for backend payloads that may return arrays or paged result objects.

Rule: feature modules should call typed API functions from their own `api.ts` files, not call `fetch` directly.

### `src/features`

Each feature owns its own API wrappers, screens, helpers, and local components.

- `auth`: login, register, token/session storage, redirect safety, auth context
- `listings`: listing search, listing cards, listing details, gallery, filters
- `inquiries`: inquiry form and user inquiry list
- `profile`: authenticated profile page

Rule: keep feature-specific logic inside its feature folder unless it is truly shared.

### `src/components`

Reusable UI primitives and shared display components live here.

Examples:

- `Button`
- `Input`
- `Select`
- `Textarea`
- `Alert`
- `Badge`
- `Spinner`
- `EmptyState`

Rule: if a component is only used by listings, keep it in `src/features/listings/components`. Move it to `src/components` only when multiple features use it.

### `src/layouts`

- `AppLayout.tsx`: header, navigation, logout action, and page outlet
- `ProtectedRoute.tsx`: redirects unauthenticated users to login and supports role-based access checks

## Data Flow

Most pages follow this pattern:

```text
Page component
  -> feature api.ts function
  -> src/api/http-client.ts
  -> backend gateway
  -> response normalizer
  -> React Query state
  -> UI
```

Example for listing search:

```text
ListingSearchPage
  -> searchListings(filters)
  -> GET /listings
  -> normalizeListing()
  -> PropertyCard grid
```

Example for listing details:

```text
ListingDetailsPage
  -> getListing(listingId)
  -> GET /listings/{listingId}

ListingDetailsPage
  -> getListingMedia(listingId)
  -> GET /media/listings/{listingId}
```

## Auth And Session Behavior

The backend uses JWT bearer auth.

Current behavior:

- Login calls `POST /auth/login`
- Register calls `POST /auth/register`
- Profile calls `GET /auth/profile`
- Tokens are stored through `src/features/auth/auth-storage.ts`
- Protected requests attach `Authorization: Bearer <token>`
- `401` clears the stored session and redirects to login
- `403` routes to `/not-authorized`
- Redirect query values are sanitized so external URLs are not accepted
- If login/register returns a token without user details, the app fetches the profile after storing the token
- On app startup, if a token exists but no user is stored, the app hydrates the profile from the backend

Supported registration roles in the UI:

- `buyer`
- `agent`

Admin registration is intentionally not exposed.

## Main Routes

```text
/                    Property search and listing grid
/listings/:listingId Property details
/login               Login page
/register            Registration page
/profile             Protected profile page
/inquiries           Protected user inquiries page
/not-authorized      Permission error page
```

## Backend Endpoints Used

```text
GET  /listings
GET  /listings/{listingId}
GET  /media/listings/{listingId}
POST /auth/register
POST /auth/login
GET  /auth/profile
POST /inquiries
GET  /inquiries/mine
```

## Adding A New Backend Call

1. Add the endpoint path or builder to `src/config/api-endpoints.ts`.
2. Add or update shared types in `src/types/domain.ts` if needed.
3. Add a feature-level function in the relevant `src/features/<feature>/api.ts`.
4. Use `apiRequest` from `src/api/http-client.ts`.
5. Normalize backend response shapes before returning data to components.
6. Use React Query in the page/component for loading, error, and refresh behavior.

## Adding A New Page

1. Add the route path to `src/config/routes.ts`.
2. Add navigation in `src/config/navigation.ts` if it belongs in the header.
3. Create the page under the matching `src/features/<feature>` folder.
4. Register the route in `src/App.tsx`.
5. Wrap the page in `ProtectedRoute` if it requires login.

## UI Guidelines

- Keep forms clear and compact.
- Always show loading, error, empty, and success states where relevant.
- Prefer existing UI primitives from `src/components/ui`.
- Keep repeated dimensions stable with Tailwind aspect ratios and grid rules.
- Avoid hardcoded backend or route values inside components.

## Known Scope

Implemented now:

- Public marketplace browsing
- Listing details
- Auth/profile/session hardening
- Inquiry creation and inquiry list

Not implemented in this frontend scope yet:

- Admin dashboard
- Agent listing creation/editing
- Media upload manager
- Paid ad checkout
- Payment administration

## Build Verification

Run this before handing off changes:

```bash
npm run build
```

If Node hits a local filesystem permission issue in the managed sandbox, rerun the same build in the approved elevated path. Do not change source code just to work around that sandbox-specific issue.
