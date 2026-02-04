# 800Storage Frontend Test

A polished Angular (standalone) single‑page application that showcases a responsive user directory, theming, and clean UX using the ReqRes API. Built for a hiring task with professional structure and documentation.

## Highlights
- Paginated users list (centered and responsive)
- Dark/Light theme toggle with persisted preference
- Custom UI styling (no external UI library required)
- Standalone Angular components (no NgModules)
- API key handling via HTTP interceptor
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

## Project Structure (high level)
```
src/
  app/
    components/
      header/              # Top bar with theme toggle
    pages/
      users/               # Users list + pagination
    core/
      interceptors/        # API key handling
      services/            # Theme service
  environments/
    environment.ts         # ReqRes API key
```

## Notes for Reviewers
- The UI is fully responsive and optimized for desktop and mobile.
- Theme preference is persisted in localStorage and applied on load.
- Clean, standalone structure allows fast extension (detail page, search, caching).
