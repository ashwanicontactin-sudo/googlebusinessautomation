# AGENTS.md

This file defines conventions for the Business Listing Platform project.
Agents working in this repository should follow these guidelines.

## Project Overview

A unified business listing platform that supports multi-platform submission (Google Business, Bing, JustDial, IndiaMart, Yelp) with open-source maps and a Win95-themed UI.

## Directory Structure

```
googlebusinessautomation/
├── backend/                    # Python FastAPI backend
├── frontend/                   # TypeScript React frontend (Vite)
├── shared/                     # Shared utilities and types
├── docs/                       # Additional documentation
├── .env                        # Environment variables (gitignored)
├── ailog.md                    # AI development log
├── prompt.md                   # Prompt tracking
├── error.log                   # Error log
├── version.md                  # Changelog
├── ack.md                      # Acknowledgments
├── security.md                 # Security policy
├── docker-compose.yml          # Docker orchestration
├── AGENTS.md                   # This file
└── README.md
```

## Backend Conventions (Python)

- Framework: FastAPI
- ORM: SQLAlchemy 2.0
- Config: Pydantic BaseSettings from `.env`
- API versioning: `/api/v1/`
- Type hints required on all functions
- Run: `cd backend && python run.py`
- Lint: `flake8` or `ruff`
- Format: `black`
- Type check: `mypy`

### Backend Commands

```bash
cd backend
pip install -r requirements.txt
python run.py              # Start dev server
flake8 app/                # Lint
black app/                 # Format
mypy app/                  # Type check
pytest app/tests/          # Tests
pip-audit -r requirements.txt  # Security scan
```

## Frontend Conventions (TypeScript)

- Framework: React 18 + Vite
- Language: TypeScript
- Styling: Plain CSS with Win95 theme (no external CSS frameworks)
- Routing: React Router DOM v6
- Testing: Vitest + Testing Library
- Lint: ESLint + Prettier

### Frontend Commands

```bash
cd frontend
npm install
npm run dev                # Start dev server (port 5173)
npm run build            # Production build
npm run lint            # Lint
npm run lint:fix        # Lint + auto-fix
npm run typecheck       # Type check
npm run preview         # Preview production build
```

## Commit Conventions

Use conventional commit messages:
- `feat: ...` — new feature
- `fix: ...` — bug fix
- `docs: ...` — documentation change
- `style: ...` — formatting, whitespace
- `refactor: ...` — code refactoring
- `test: ...` — adding or fixing tests
- `chore: ...` — maintenance tasks

## Security Notes

- Never commit secrets to the repository
- Review `security.md` before adding new dependencies
- Sanitize all user input
- Use parameterized queries
- Run `pip-audit` on backend, `npm audit` on frontend, `ggshield scan` for secrets
- Use Caddy reverse proxy for HTTPS termination and security headers in production

## Documentation Updates

When making changes, update:
1. `version.md` — add entry under `[Unreleased]`
2. `ailog.md` — log AI decisions
3. `AGENTS.md` — update conventions if needed
