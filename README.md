# Webdev Template · Python

A small starting point for a web app with a Python backend: **Bun, Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, FastAPI, and uv**.

The frontend and backend are separate applications in one repository. One command starts both for development. The starter page includes a button that requests a message from Python through a Next.js route.

## Start a project

1. Click **Use this template → Create a new repository** on GitHub.
2. Clone your new repository and open its folder in a terminal.
3. Install [Bun](https://bun.sh/docs/installation) **1.4.2** and [uv](https://docs.astral.sh/uv/getting-started/installation/) **0.12.23**. uv installs Python **3.13** automatically if needed.
4. Run:

   ```sh
   bun run setup
   bun run dev
   ```

Open **http://localhost:3000**. FastAPI's interactive API documentation is at **http://127.0.0.1:8000/docs**. Click **Check connection** on the starter page to check the complete browser → Next.js → FastAPI connection.

No environment file or API keys are needed locally. The two development ports are fixed at `3000` and `8000`; stop anything already using them before starting. `Ctrl+C` stops both services. If either service exits, the other is stopped too.

## Everyday commands

Run these from the repository root:

| Command | What it does |
| --- | --- |
| `bun run setup` | Install locked root, frontend, and Python dependencies |
| `bun run dev` | Start Next.js and FastAPI with reload |
| `bun run dev:web` | Start only Next.js on port 3000 |
| `bun run dev:api` | Start only FastAPI on port 8000 |
| `bun run check` | Run frontend checks, Ruff lint/format checks, and Python tests |
| `bun run check:web` | Run frontend checks only |
| `bun run check:api` | Run backend checks only |
| `bun run build` | Build the Next.js production application |
| `bun run test:smoke` | Start the built app and API, check their connection, then stop both |
| `bun run start:web` | Start the built Next.js application |
| `bun run start:api` | Start FastAPI without reload or development dependencies |

## Where to work

```text
frontend/
  src/app/                   Pages, layouts, styles, and Next.js API routes
  src/components/            React components
    ui/                      shadcn/ui components owned by your app
  src/lib/                   Frontend utilities
  public/                    Static files
  .env.example               Optional server-side backend URL
  bun.lock                   Locked frontend dependencies
backend/
  app/main.py                FastAPI app, response models, and example routes
  tests/test_api.py           API contract tests
  pyproject.toml             Python dependencies and tool configuration
  uv.lock                    Locked Python dependencies
  .python-version            Python 3.13
.github/workflows/checks.yml  Automated checks on pushes and pull requests
package.json                 Commands coordinating both applications
bun.lock                     Locked development launcher dependency
```

Start by editing `frontend/src/app/page.tsx` and replacing the example in `backend/app/main.py` with one feature of your app. Use `frontend/src/app/layout.tsx` to set your app's name and description.

To add a shadcn component:

```sh
cd frontend
bunx --bun shadcn@latest add input
```

The components are copied into `frontend/src/components/ui/`, so you can change them directly. Add frontend dependencies from `frontend/` with `bun add package-name`; add Python dependencies from `backend/` with `uv add package-name`. Commit the matching lockfile whenever dependencies change.

## How the API connection works

```text
Browser GET /api/message
  → Next.js frontend/src/app/api/message/route.ts
  → FastAPI backend/app/main.py GET /api/message
  → { "message": "Hello from FastAPI." }
```

The browser only calls its own Next.js origin. Next.js contacts FastAPI on the server, so this example does not need CORS configuration. The route forwards only this specific request; add an explicit route for each API operation your app needs.

`BACKEND_URL` is a **server-only** Next.js environment variable, defaulting to `http://127.0.0.1:8000`. To change it, copy `frontend/.env.example` to `frontend/.env.local`, edit the value, and restart Next.js. Set it to the backend origin, without an API path. Do not add a `NEXT_PUBLIC_` prefix: browsers do not need the backend address. Keep secrets in ignored local environment files or your host's environment settings.

If Python is unavailable or takes more than five seconds, the Next.js route returns a friendly `503` response and the page offers a retry. Next.js `/api/health` checks only the frontend; FastAPI `/health` checks the backend. The frontend can build without the backend running.

## Deploying

Deploy the two applications as separate services:

- **Next.js:** use `frontend/` as the project root. Install with `bun install --frozen-lockfile`, build with `bun run build`, and start with `bun run start` on a server that supports Bun, or use a host's Next.js integration. Set the server-side `BACKEND_URL` to the deployed FastAPI origin.
- **FastAPI:** use `backend/` as the project root. Install with `uv sync --locked --no-dev` and run `uv run --locked --no-dev uvicorn app.main:app --host 0.0.0.0 --port 8000`. If your host supplies a different port, pass that value to `--port` in its start command. Use Python 3.13 and configure HTTPS through your host.

`bun run dev` is for local development. In production, let your host manage each service's lifecycle. This template includes public example endpoints; add authentication and authorisation when your application needs protected data or actions. The server-to-server connection itself does not authenticate requests to FastAPI.

For a local production check, run `bun run build`, then run `bun run start:web` and `bun run start:api` in separate terminals.

## Checks and maintenance

GitHub Actions installs the committed lockfiles, runs `bun run check`, builds the frontend, and runs `bun run test:smoke` to check the page and running API connection. The smoke check needs ports 3000 and 8000 available. The dependency versions tested with this template are recorded in `package.json`, `frontend/package.json`, `backend/pyproject.toml`, and their lockfiles.

As of 10 October 2026, the frontend's `bun audit` reports an unpatched [nested-pattern denial-of-service issue in `braces`](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), reached only through ESLint and shadcn development tooling in this template. It is absent from the production dependency graph. Recheck the advisory when updating dependencies; `bun audit fix` currently has no published fix.

After creating your repository, rename the package entries in those files, update the page metadata, and replace this README with instructions for your application. Regenerate lockfiles after changing package metadata. Keep `LICENSE` if you are using its MIT terms; see the [MIT license](LICENSE).

Useful references: [Next.js documentation](https://nextjs.org/docs), [Bun with Next.js](https://bun.sh/guides/ecosystem/nextjs), [shadcn/ui](https://ui.shadcn.com/docs), [FastAPI](https://fastapi.tiangolo.com/), and [uv projects](https://docs.astral.sh/uv/guides/projects/).
