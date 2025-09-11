# Backend Architecture (v2 Incremental Refactor)

This document outlines the incremental refactor introducing a versioned `v2` API alongside legacy endpoints. Goal: cleaner contracts, consistent list handling, clearer separation of layers (schemas, repositories, services, routers).

## Layers

1. core: settings & logging configuration.
2. models: (reuse existing Beanie documents initially).
3. repositories: Thin data-access wrappers (future extraction – not all implemented yet).
4. schemas/v2: Pydantic request/response DTOs (decoupled from persistence fields where needed).
5. api/v2: Versioned routers (mounted under `/api/v2`).
6. services: (reuse existing for auth & resume email for now).

## Versioning Strategy

Legacy endpoints remain at `/api/*` (jobs, resumes, etc.). New endpoints live at:

```
/api/v2/auth/*
/api/v2/resumes/*
/api/v2/jobs/*
```

Once v2 reaches parity, legacy will be deprecated in stages.

## Data Normalization

Legacy stored multi-line strings for job responsibilities/requirements/benefits. V2 returns arrays consistently and accepts arrays or strings on input. Resume work/project description values exposed as `description_list` arrays.

## Minimal Implemented v2 Endpoints (Phase 1)

Auth:
- POST /api/v2/auth/login
- GET  /api/v2/auth/me

Health (namespaced):
- GET /api/v2/health

Resumes:
- GET /api/v2/resumes/{member_id}

Jobs:
- GET /api/v2/jobs (list, q, is_active, limit)

Additional create/update endpoints will be migrated in Phase 2.

## Next Steps

1. Add repositories for jobs & resumes (encapsulate normalization logic).
2. Add create/update/delete v2 routes with stricter validation.
3. Introduce pagination cursor patterns.
4. Add automated tests targeting v2 endpoints.
5. Migrate frontend to consume v2 gradually.

## Testing

Short-term: legacy tests unaffected. New tests will be added in `tests/v2/` for isolation.

---

Incremental refactor approved assumptions:
- Voting feature deferred.
- Public resume submit remains legacy only until auth enforcement decided.
