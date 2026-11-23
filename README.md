# Anqi Chen — MAIE Final Project

The current work is **Age Verification Passport**, a fictional physical–digital exhibition exploring age-assurance data requests, provider assessments and platform access decisions.

## Current prototype

The runnable static website is in [`master_web/`](master_web/). Open a discussion in COMMONROOM, use supplied fictional character details, encounter LENS checks and alternatives, then inspect the data trail and printable Passport record. No real identity information, uploads, camera or verification API is used.

```sh
cd master_web
python3 -m http.server 8080
```

Open http://localhost:8080. Full operation, research boundaries, storage, paper dimensions and verification notes are in [the website README](master_web/README.md).

## Cloudflare Pages

When this complete repository is connected to Cloudflare Pages:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | Leave empty |
| Build command | `exit 0` |
| Build output directory | `master_web` |
| Environment variables | None required |

Select the actual production branch. This serves the current website; no backend or database is needed. Publishing the site is a separate step from uploading this repository.

## Local-only materials

Only `master_web/` and the root repository documentation are included here. The complete local `resources/` directory (research, thesis, previous examples and the earlier Platform Potentials project) is excluded. Both `resources/` and `resource/` are protected by `.gitignore`, along with generated dependencies, caches and local configuration.
