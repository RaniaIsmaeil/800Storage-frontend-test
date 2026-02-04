# 800Storage Frontend Test

A polished Angular (standalone) single‑page application that showcases a responsive user directory, theming, search, and caching using the ReqRes API. Built for a hiring task with professional structure and documentation.

## Highlights
- Paginated users list (centered and responsive)
- User details page with back navigation
- Instant search by user ID with live results
- Dark/Light theme toggle with persisted preference
- Custom UI styling
- Standalone Angular components (no NgModules)
- API key handling via HTTP interceptor
- Cached API responses to avoid repeat requests
- Loading state UI while data is fetched

## Tech Stack
- Angular 20 (standalone APIs)
- RxJS
- ReqRes API

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Add your ReqRes API key
ReqRes now requires an API key for requests. Create one at `https://reqres.in`.

Update the key in:
```
src/environments/environment.ts
```

```ts
export const environment = {
  apiKey: 'YOUR_KEY_HERE'
};
```

### 3) Run the app
```bash
npm start
```
Open `http://localhost:4200/` in your browser.

## API Usage
The app consumes the ReqRes API:
- List users: `https://reqres.in/api/users?page={page}`
- Single user: `https://reqres.in/api/users/{id}`

The API key is attached automatically to each request via an HTTP interceptor at:
```
src/app/core/interceptors/api-key.interceptor.ts
```

## Caching
API responses are cached in-memory (per page and per user) via a shared service to avoid duplicate network calls. This keeps pagination, details, and search fast.

## Project Structure (high level)
```
src/
  app/
    components/
      header/ # Top bar + theme + search
    pages/
      users/ # Users list + pagination
      user-details/ # User details page
    core/
      interceptors/ # API key handling
      services/ # Theme + ReqRes caching service
  environments/
    environment.ts # ReqRes API key
```

## Notes for Reviewers
- The UI is fully responsive and optimized for desktop and mobile.
- Theme preference is persisted in localStorage and applied on load.
- Search by ID is instant and supports partial matches (e.g., `1` shows `1`, `11`).
- ReqRes demo data provides two pages of users; pagination reflects the API response.
