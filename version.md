# Version History

All notable changes to the Business Listing Platform project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Fixed
- Listing submission now preserves the selected platform and submits it after
  the business record is created.
- Added Apple Business Connect to supported listing platforms.
- Added visible account registration and a four-step listing submission wizard.
- Added first-party public listing pages with stable shareable URLs and dashboard links.
- Added business-owner and developer account types plus logo customization in listing setup.
- Added API security response headers and restrictive CORS allowlists.

### Added
- Google OAuth and Meta OAuth entry points for Facebook/Instagram sign-in.
- Login screen buttons for social authentication, with `.env` configuration.

## [1.2.0] — 2024-01-15

### Added
- **Google Analytics Integration**
  - GA4 measurement ID support via `VITE_GA_MEASUREMENT_ID` env var
  - Automatic script injection in `main.tsx`
- **Multi-Platform Ad Integrations**
  - Google Ads conversion tracking
  - Meta / Facebook Pixel support
  - Apple Search Ads integration
  - Microsoft Advertising (Bing Ads) support
  - LinkedIn Ads support
- **AnalyticsConfig Page** — UI for users to enter their tracking IDs for all ad platforms
- **Backend Analytics Config API** — `/api/v1/ads/analytics-config` and `/api/v1/ads/platforms`

### Changed
- Backend: Replaced `python-jose` with `PyJWT[crypto]` to eliminate `ecdsa` vulnerability (PYSEC-2026-1325)
- Frontend: Upgraded Vite and Vitest to latest versions (fixed `esbuild` CVEs)
- Security: Verified 0 vulnerabilities via `pip-audit` and `npm audit`

---

## [1.1.0] — 2024-01-15

### Added
- **Maps & Location**
  - OpenStreetMap integration via react-leaflet on Businesses page
  - BusinessMap component with marker popups and geocoding
  - Location display during listing submission
- **Ads & Monetization**
  - Ad campaign management (CRUD, launch, pause)
  - Keyword research tool with search volume data
  - HTML ad embed creation for businesses
  - Photo and video upload with media management (MediaGallery component)
  - Ad performance stats (impressions, clicks)
- **SEO & Keywords**
  - User-friendly SEO keywords selector with categories
  - SEO-optimized description field with live word counter (50-word minimum)
  - Keywords stored per business and displayed in listings
- **Traffic Analytics**
  - Traffic tracking by source platform (Google, Bing, JustDial, IndiaMart, Yelp)
  - Analytics dashboard with stat cards and source breakdown
  - Integration with ad campaign performance
- **Security & Infrastructure**
  - Open-source Caddy reverse proxy with automatic HTTPS
  - Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
  - Rate limiting on API and auth endpoints
  - Docker Compose with hardened networking (backend/frontend not exposed directly)
  - Snyk configuration (`snyk.yml`, `.snyk`) for dependency scanning
  - GitGuardian configuration (`.gitguardian.yml`) for secret detection

### Changed
- Backend: Migrated to SQLAlchemy 2.0 `DeclarativeBase`, Pydantic v2 `model_config`
- Backend: Replaced deprecated `@app.on_event` with FastAPI lifespan context manager
- Backend: Added `pydantic-settings` as explicit dependency
- Business API: Added `keywords`, `description_seo`, `plan_tier`, `is_paid` fields
- Docker Compose: Backend and PostgreSQL no longer exposed to host
- Updated project structure diagrams in README.md

---

## [1.0.0] — 2024-01-15

### Added
- **Backend**
  - FastAPI application with modular API structure (`app/api/`)
  - Business management endpoints (CRUD: `/api/v1/businesses`)
  - Listing platform discovery and submission (`/api/v1/listings`)
  - Authentication endpoints (`/api/v1/auth`)
  - Location management endpoints (`/api/v1/locations`)
  - SQLAlchemy ORM models (`app/models/`)
  - Listing service with OpenStreetMap Nominatim geocoding (`app/services/`)
  - Database session dependency (`app/utils/db.py`)
  - Pydantic settings management from `.env` (`app/config.py`)
  - Health check endpoint
  - CORS middleware configuration
  - Backend tests (`app/tests/`)
  - Requirements.txt with all dependencies
  - Entry point script (`run.py`)

- **Frontend**
  - React 18 + TypeScript application with Vite build system
  - Win95 thick-border themed UI components
  - Pages: Home, Businesses, SubmitListing, Platforms, Login
  - Reusable components: Layout, Header, Footer
  - CSS style system: `globals.css`, `win95.css`, page-specific styles
  - TypeScript type definitions (`src/types.ts`)
  - React Router DOM for client-side routing
  - ESLint + Prettier configuration
  - Frontend tests with Vitest + Testing Library

- **Infrastructure & Documentation**
  - `.env` and `.env.example` for environment configuration
  - `AGENTS.md` with coding conventions and commands
  - `ailog.md` for AI development decisions
  - `prompt.md` for developer prompt tracking
  - `error.log` for error tracking
  - `version.md` (this file) for version history
  - `ack.md` for acknowledgments and attributions
  - `security.md` for security guidelines
  - Docker-ready project structure (Dockerfile for backend and frontend, docker-compose.yml)

### Planned (Future Release)
- Database migrations with Alembic
- OAuth2 authentication with JWT
- Background task queue with Celery for async listing submissions
