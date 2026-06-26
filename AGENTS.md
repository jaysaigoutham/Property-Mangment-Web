# Agent Standards

This file defines the working standards for AI agents and developers contributing to the Property Marketplace frontend.

## Project Summary

This is a React + Vite + TypeScript frontend for a property listing marketplace. It connects to an existing .NET API gateway through:

```text
VITE_API_BASE_URL=http://localhost:8080
```

The frontend currently supports public listing search, listing details, authentication/profile, and inquiries.

## Required Commands

Use these commands from the repository root:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Before handing off code changes, run:

```bash
npm run build
```

If the managed sandbox blocks Node with an `EPERM` filesystem error, rerun the same build through the approved elevated command path. Do not change application code to work around sandbox-only filesystem behavior.

## Architecture Rules

Keep the existing layered architecture:

```text
src/
  api/          Shared HTTP client, errors, response helpers
  components/   Reusable UI primitives and shared UI states
  config/       Central app configuration
  features/     Feature modules
  layouts/      App shell and route guards
  types/        Shared DTOs and domain types
```

Do not bypass these boundaries:

- Do not hardcode route paths inside feature components.
- Do not hardcode backend endpoint paths inside feature components.
- Do not call `fetch` directly from page components.
- Do not read or write JWT storage outside `src/features/auth/auth-storage.ts`.
- Do not put feature-only components in `src/components` unless they are reused by multiple features.

## Central Configuration Standard

Use `src/config` for app-wide values:

- `env.ts`: environment values
- `api-endpoints.ts`: backend endpoint paths and builders
- `routes.ts`: frontend paths and route builders
- `navigation.ts`: branding and nav links
- `filters.ts`: listing filter defaults and options
- `auth.ts`: token keys, auth route settings, role labels
- `media.ts`: fallback property images

When adding a new route, endpoint, role label, filter option, or global default, update `src/config` first.

## API Standard

All backend calls must go through:

```text
src/api/http-client.ts
```

Feature modules should expose typed functions from their own `api.ts` files.

Expected flow:

```text
Page component
  -> feature api.ts
  -> apiRequest()
  -> backend gateway
  -> response normalizer
  -> React Query state
  -> UI
```

Use tolerant normalizers for backend responses because gateway payloads may return arrays directly or wrappers such as `items`, `data`, `results`, or `value`.

## Auth Standard

The backend uses JWT bearer auth.

Current frontend behavior:

- Login: `POST /auth/login`
- Register: `POST /auth/register`
- Profile: `GET /auth/profile`
- Protected calls attach `Authorization: Bearer <token>`
- `401` clears the stored session and redirects to login
- `403` routes to `/not-authorized`
- Redirect query values must be sanitized with `sanitizeRedirectPath`

Rules:

- Store and clear session data only through `auth-storage.ts`.
- Keep login/register response handling tolerant of token-only and token-plus-user payloads.
- If a token exists without a stored user, hydrate profile through `GET /auth/profile`.
- Do not expose admin registration in the UI unless the product scope changes.

## Feature Standards

### Listings

Listing search and details are public.

Use:

- `GET /listings`
- `GET /listings/{listingId}`
- `GET /media/listings/{listingId}`

Listing details must remain usable if media loading fails. Show fallback images and keep details visible.

### Inquiries

Inquiry actions require authentication.

Use:

- `POST /inquiries`
- `GET /inquiries/mine`

After creating an inquiry, invalidate or refresh inquiry data through React Query.

### Profile

Profile is protected.

Show stored profile data immediately when available, then refresh from the backend.

## UI Standards

- Use existing UI primitives from `src/components/ui`.
- Show loading, error, empty, and success states where relevant.
- Keep forms compact and clear.
- Disable submit controls while a form is submitting.
- Keep repeated layout dimensions stable with Tailwind grid and aspect-ratio utilities.
- Use lucide-react icons where icons are needed.
- Avoid decorative-only UI that does not support the workflow.

## Styling Standard

The project uses Tailwind CSS.

Prefer existing palette patterns:

- Emerald for primary actions and active states
- Stone neutrals for layout, borders, and text
- Amber for warnings/fallback notices
- Rose for destructive or authorization errors
- Sky for backend/system states

Keep cards and panels simple with modest radius and clear spacing.

## Adding A Backend Call

1. Add the endpoint to `src/config/api-endpoints.ts`.
2. Add or update shared types in `src/types/domain.ts`.
3. Add a feature-level function in `src/features/<feature>/api.ts`.
4. Call `apiRequest`.
5. Normalize the response before returning data to UI components.
6. Use React Query in the page/component.

## Adding A Page

1. Add the route to `src/config/routes.ts`.
2. Add nav config in `src/config/navigation.ts` only if it belongs in the header.
3. Create the page under `src/features/<feature>`.
4. Register the route in `src/App.tsx`.
5. Wrap protected pages with `ProtectedRoute`.

## Files And Generated Artifacts

Do not commit:

- `node_modules/`
- `dist/`
- `.env`
- local logs
- `work/` scratch files

User-facing deliverables belong in:

```text
outputs/
```

## Current Out Of Scope

Do not implement these unless explicitly requested:

- Admin dashboard
- Agent listing creation/editing
- Media upload manager
- Paid ad checkout
- Payment administration
- Refresh-token rotation

## Handoff Checklist

Before final response after code changes:

1. Confirm files changed.
2. Run `npm run build` unless the change is docs-only.
3. Mention any command that could not be run.
4. Summarize user-visible behavior changes.
5. Keep the response concise and include links to important files.
