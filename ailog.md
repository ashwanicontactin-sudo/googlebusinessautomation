# AI Development Log

This file tracks AI-assisted development decisions, model interactions, and learnings for the Business Listing Platform project.

---

## [2024-01-15] Project Initialization

### Context
- Developer requested a business listing platform inspired by Google Business, Bing, JustDial, IndiaMart
- Requirements: free + paid features, open-source maps, Win95-thick-border UI, Python backend, TypeScript frontend

### AI Decisions
- **Backend framework**: FastAPI chosen for automatic OpenAPI docs, async support, and Pythonic schema definitions
- **Frontend framework**: React + Vite for lightweight build, TypeScript for type safety
- **Database**: PostgreSQL via SQLAlchemy 2.0 for ACID compliance and geospatial queries
- **Cache**: Redis for session storage and rate limiting
- **Maps**: OpenStreetMap + Nominatim (open source, no vendor lock-in)
- **Container**: Docker Compose for reproducible dev environment

### AI Recommendations Logged
1. Use Pydantic v2 for config/settings (BaseSettings) — implemented in `backend/app/config.py`
2. Separate API routes into modular files under `app/api/` — implemented
3. Use SQLAlchemy ORM models in `app/models/` — implemented
4. Use dependency injection for DB session (`get_db`) — implemented in `app/utils/db.py`
5. Enable CORS middleware for frontend-backend communication — implemented in `app/main.py`

---

## [2024-01-15] Architecture Notes

### Multi-Platform Submission Strategy
- Each platform (Google, Bing, JustDial, etc.) will have a dedicated service adapter
- Adapters will be added to `app/services/` as needed
- Common interface: `submit(business_data: dict) -> SubmissionResult`

### Tier Model (Free vs Paid)
- Free tier: basic listing data (name, address, phone)
- Paid tier: enhanced visibility, photo uploads, real-time status sync
- Feature flags will be implemented via plan-based middleware

---

## [2024-01-15] Phase 2 — Feature Expansion

### Context
- Developer requested additional features: open-source maps, ads, keywords, SEO, traffic analytics
- Security scanning with Snyk and GitGuardian
- Open-source reverse proxy (Caddy) for production security

### AI Decisions
- **Maps**: Added `react-leaflet` + OpenStreetMap for business location display on Businesses page and Ads dashboard
- **Ads**: Full ad campaign management — CRUD, launch/pause, keyword research, HTML embed ads, photo/video uploads (`app/api/ads.py`, `app/api/media.py`, `src/pages/Ads.tsx`)
- **Keywords**: SEO keyword system with search volume data, integrated into SubmitListing form
- **SEO Description**: Word counter + SEO-optimized description field with 50-word minimum recommendation
- **Traffic Analytics**: Track visits by source platform (google, bing, justdial, indiamart, yelp) (`app/api/analytics.py`, `src/pages/Analytics.tsx`)
- **Reverse Proxy**: Open-source Caddy server with TLS, security headers (CSP, HSTS, X-Frame-Options), rate limiting (`reverse-proxy/Caddyfile`)
- **Security**: GitGuardian config for secret scanning, Snyk config for vulnerability scanning (`.gitguardian.yml`, `snyk.yml`, `.snyk`)
- **Backend**: Modernized to SQLAlchemy 2.0 `DeclarativeBase`, Pydantic v2 `model_config`, FastAPI lifespan events

### Files Changed
- `backend/app/api/ads.py` — created (ad campaigns, keywords)
- `backend/app/api/media.py` — registered (media upload, HTML ad embeds)
- `backend/app/api/analytics.py` — created (traffic tracking)
- `backend/app/api/business.py` — updated (keywords, SEO description, plan_tier, is_paid)
- `backend/app/api/locations.py` — updated (ConfigDict)
- `backend/app/models/__init__.py` — updated (keywords, description_seo, plan_tier fields)
- `backend/app/main.py` — updated (lifespan, removed on_event deprecation)
- `backend/app/api/__init__.py` — updated (registered ads, analytics, media routes)
- `frontend/src/components/BusinessMap.tsx` — created (Leaflet OpenStreetMap)
- `frontend/src/pages/Ads.tsx` — created (ad dashboard, keyword research)
- `frontend/src/pages/Analytics.tsx` — created (traffic dashboard, ad stats)
- `frontend/src/pages/SubmitListing.tsx` — updated (keywords selector, SEO description, word count, plan tiers)
- `frontend/src/pages/Businesses.tsx` — updated (map integration, keywords column, plan badge)
- `frontend/src/pages/Home.tsx` — updated (removed unused import)
- `frontend/src/types.ts` — updated (AdCampaign, Keyword interfaces)
- `frontend/src/App.tsx` — updated (new routes)
- `frontend/src/components/Header.tsx` — updated (nav links)
- `reverse-proxy/Caddyfile` — created (Caddy reverse proxy)
- `snyk.yml` — created
- `.snyk` — created
- `.gitguardian.yml` — created
- `docker-compose.yml` — updated (Caddy service, security hardening)
- `backend/requirements.txt` — updated (pydantic-settings)

### Verification
- Backend: flake8 0 errors, black 0 changes, mypy 0 issues, pytest 3 passed
- Frontend: ESLint 0 errors, TypeScript typecheck 0 errors

---

## [2024-01-15] Phase 3 — Analytics & Ad Platform Integration

### Context
- Developer requested Google Analytics support and integration with Google Ads, Meta Pixel, Apple Search Ads, and other ad platforms
- Requested live link to run the software and pip updates

### AI Decisions
- **Google Analytics**: Added GA4 measurement ID support via `VITE_GA_MEASUREMENT_ID` env var, with automatic script injection in `main.tsx`
- **Ad Platform Integrations**: Added backend APIs for Google Ads, Meta/Facebook Pixel, Apple Search Ads, Microsoft/Bing Ads, LinkedIn Ads
- **AnalyticsConfig Page**: New page for users to enter tracking IDs for all supported ad platforms
- **Security Fix**: Replaced `python-jose` (vulnerable `ecdsa` 0.19.2, PYSEC-2026-1325) with `PyJWT[crypto]` — pip-audit: 0 vulnerabilities
- **Frontend Upgrade**: Upgraded Vite to 8.2.2 and Vitest — npm audit: 0 vulnerabilities

### Files Changed
- `backend/app/api/ads.py` — added `/platforms` and `/analytics-config` endpoints
- `frontend/src/pages/AnalyticsConfig.tsx` — new page for ad platform tracking IDs
- `frontend/src/main.tsx` — GA4 script injection
- `frontend/src/App.tsx` — added `/analytics/config` route
- `frontend/src/components/Header.tsx` — added "Ad Integrations" nav link
- `.env` — added `VITE_GA_MEASUREMENT_ID`
- `backend/requirements.txt` — replaced `python-jose` with `PyJWT[crypto]`

### Verification
- Frontend: ESLint 0 errors, TypeScript typecheck 0 errors
- Backend: flake8 0 errors, black 0 changes, mypy 0 issues, pytest 3 passed
- pip-audit: 0 vulnerabilities
- npm audit: 0 vulnerabilities

## [2026-09-03] Social Authentication

- Added Google OAuth and Meta OAuth entry points for Facebook/Instagram identity.
- Added environment variables for provider client IDs and callback URLs.
- Added login-page social buttons with a clear configuration error when OAuth credentials are absent.
