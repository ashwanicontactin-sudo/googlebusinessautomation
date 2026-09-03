# Business Listing Platform

A unified, open-source business listing platform that lets users manage and publish business listings across Google, Bing, JustDial, IndiaMart, Yelp, and more — with a unique Windows 95-inspired UI.

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)

## Architecture

```
Frontend (React + TypeScript)  <--->  Backend (FastAPI + Python)  <--->  PostgreSQL / Redis
                                      |
                                      +---> External Platforms (Google, Bing, JustDial, IndiaMart)
                                      |
                                      +---> OpenStreetMap / Nominatim (geocoding)
```

## Features

- **Multi-platform listing** — Submit to Google Business, Bing Places, JustDial, IndiaMart, and Yelp
- **Free and paid tiers** — Basic features free, premium for advanced publishing
- **Open source maps** — OpenStreetMap + Nominatim for geocoding and location display
- **Win95 design** — Thick borders, classic Windows 95 aesthetic
- **Full API** — RESTful API with FastAPI and automatic OpenAPI docs
- **Ads & monetization** — Create ad campaigns, HTML ad builder, photo/video uploads, keyword research
- **SEO tools** — Keywords, SEO-optimized descriptions with word counter, search volume data
- **Traffic analytics** — Track visits by source platform (Google, Bing, JustDial, IndiaMart, Yelp)
- **Secure reverse proxy** — Caddy with automatic HTTPS, security headers, and rate limiting
- **Security scanning** — Snyk + GitGuardian configuration for dependency and secret scanning

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Frontend      | React 18 + TypeScript + Vite        |
| Maps          | Leaflet + OpenStreetMap             |
| Backend       | FastAPI (Python 3.12+)              |
| ORM           | SQLAlchemy 2.0                      |
| Database      | PostgreSQL                          |
| Cache         | Redis                               |
| Maps Geocode  | OpenStreetMap / Nominatim         |
| Reverse Proxy | Caddy 2 (auto HTTPS, rate limit)    |
| Container     | Docker / Docker Compose             |
| Security      | Snyk, GitGuardian (ggshield)        |

## Project Structure

```
googlebusinessautomation/
├── backend/                    # Python backend (FastAPI)
│   ├── app/
│   │   ├── api/                # API route handlers (auth, businesses, listings, ads, analytics, media)
│   │   ├── models/             # SQLAlchemy 2.0 models
│   │   ├── services/           # Business logic services (listing, geocoding)
│   │   ├── utils/              # Utilities (db, helpers)
│   │   └── tests/              # Backend tests
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py
├── frontend/                   # TypeScript frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI (Layout, Header, Footer, BusinessMap, MediaGallery)
│   │   ├── pages/              # Pages (Home, Businesses, SubmitListing, Ads, Analytics, etc.)
│   │   ├── styles/             # CSS (Win95 themed)
│   │   └── types.ts
│   ├── public/                 # Static assets
│   ├── tests/                  # Frontend tests
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── eslint.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── reverse-proxy/              # Caddy reverse proxy (security, TLS, rate limiting)
│   ├── Caddyfile
│   └── Dockerfile
├── shared/                     # Shared utilities/types
├── docs/                       # Additional documentation
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── .gitignore
├── .snyk                       # Snyk ignore/exclusions
├── .gitguardian.yml            # GitGuardian secret scan config
├── AGENTS.md                   # Agent instructions
├── ailog.md                    # AI development log
├── prompt.md                   # Prompt tracking
├── error.log                   # Error log
├── version.md                  # Version history
├── ack.md                      # Acknowledgments
├── security.md                 # Security policy
├── snyk.yml                    # Snyk configuration
├── docker-compose.yml          # Docker orchestration
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (recommended)

### Quick Start with Docker

```bash
docker-compose up --build
```

The backend API will be available at `http://localhost:8000`.
The frontend will be available at `http://localhost:5173`.

### Manual Setup

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

See `.env.example` for all available options.

## API Endpoints

### Backend API (`http://localhost:8000`)

| Method | Endpoint                    | Description                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/health`                  | Health check                         |
| POST   | `/api/v1/auth/login`       | Login (returns JWT token)            |
| POST   | `/api/v1/auth/register`    | Register new user                    |
| GET    | `/api/v1/businesses`       | List all businesses                  |
| GET    | `/api/v1/businesses/{id}`  | Get a business by ID                 |
| POST   | `/api/v1/businesses`       | Create a business (with SEO, keywords) |
| PATCH  | `/api/v1/businesses/{id}`  | Update a business                    |
| DELETE | `/api/v1/businesses/{id}`  | Delete a business                    |
| GET    | `/api/v1/listings/platforms` | List supported platforms             |
| POST   | `/api/v1/listings/submit`  | Submit to a platform                 |
| GET    | `/api/v1/ads`              | List ad campaigns                    |
| POST   | `/api/v1/ads`              | Create an ad campaign                |
| GET    | `/api/v1/ads/keywords`     | List SEO keywords by category        |
| GET    | `/api/v1/ads/keywords/search?q=` | Search keywords                  |
| POST   | `/api/v1/media/upload`     | Upload photo/video                   |
| POST   | `/api/v1/media/embed`      | Create HTML ad embed                 |
| GET    | `/api/v1/analytics`        | Get traffic analytics                |
| POST   | `/api/v1/analytics/track`  | Track a traffic event                |

## Security

- Run `pip-audit` (`backend/requirements.txt`) or `snyk test` (requires API key)
- Run `npm audit` or `snyk test` for frontend dependencies
- Run `ggshield secret scan path .` for GitGuardian secret scanning
- See `security.md` for full security policy

## License

MIT
