# Security Policy

## Supported Versions

| Version  | Supported |
| -------- | --------- |
| 1.0.x    | Yes       |
| < 1.0.0  | No        |

## Security Considerations

The API now adds `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, and a restrictive `Permissions-Policy` header. CORS methods
and headers are explicitly allowlisted. Keep the Caddy proxy in front of the
application for HTTPS and rate limiting.

The current demo auth and business routes use in-memory mock storage. Before
production, replace dummy tokens with hashed-password/OAuth verification,
persist records in PostgreSQL, encrypt provider credentials, and add CSRF,
audit logging, account authorization, and migration management.

### 1. Secrets Management
- **Never commit `.env` to version control.** The `.env` file is already in `.gitignore`.
- Use `.env.example` as a template and fill in real values locally.
- Rotate `SECRET_KEY` regularly in production.

### 2. Authentication & Authorization
- Use JWT tokens with a strong signing key.
- Set token expiration appropriately (default: 30 minutes).
- Implement rate limiting on auth endpoints.

### 3. Input Validation
- All API inputs are validated with Pydantic schemas.
- Sanitize all user-supplied content before storage or display.
- Use parameterized queries with SQLAlchemy to prevent SQL injection.

### 4. CORS
- Restrict CORS origins to known frontend URLs only.
- Never use `allow_origins=["*"]` in production.

### 5. File Uploads
- Enforce maximum upload size (`MAX_UPLOAD_SIZE`).
- Store uploads outside the web root.
- Scan uploaded files for malware.
- Validate file types by content, not just extension.

### 6. Dependencies
- Regularly audit dependencies for known vulnerabilities:
  ```bash
  pip-audit
  npm audit
  ```
- Keep all dependencies updated.

### 7. API Rate Limiting
- Apply rate limits on sensitive endpoints (auth, search, submission).
- Use Caddy rate limiting or Redis-based rate limiting for distributed deployments.
- Configured in `reverse-proxy/Caddyfile` with per-endpoint limits.

### 8. Error Handling
- Never expose stack traces or internal errors to end users.
- Log errors to `error.log` with timestamps and context.

### 9. HTTPS & Reverse Proxy
- Enforce HTTPS in production via Caddy reverse proxy.
- Set `Strict-Transport-Security` headers (HSTS).
- Backend and PostgreSQL are only exposed on internal Docker networks.
- Frontend served through the reverse proxy only.
- See `reverse-proxy/Caddyfile` for full configuration.

### 10. Automated Security Scanning
- **Snyk** (`snyk.yml`, `.snyk`): scans Python and Node.js dependencies for known vulnerabilities.
  ```bash
  snyk test
  snyk monitor
  ```
- **GitGuardian** (`.gitguardian.yml`): scans for hardcoded secrets and credentials.
  ```bash
  ggshield scan
  ```
- Run both on every CI/CD pipeline job and pre-commit hook.

### 11. Reporting Vulnerabilities

If you discover a security vulnerability, please report it to:
- **Email**: security@business-listing-platform.com
- **Response time**: Within 48 hours for critical issues

Do NOT open public issues for security vulnerabilities.
