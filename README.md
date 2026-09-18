# RSM Classic Application

Offline-first host and Hub experience for the RSM Classic.

## Current slice

The `feature/hub-arrival-vertical-slice` branch now contains:

- Curated-data Hub arrival console
- Participant presence and consent capture
- Durable offline mutation queue and local audit log
- Hub Session View with dossier, route and capture tabs
- Provenance labels for confirmed, to-verify and client-stated facts
- Planned-route-primary presentation
- Service-worker caching for the arrival and session views

Run locally with a web server because ES modules and service workers require HTTP:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Scope boundary

`data-access.js` is the repository contract. `CuratedRepository` is the governed export provider used by R1. The next provider will target Dataverse Web API and must preserve append-only intelligence writes, idempotent mutations, role checks and server-side audit persistence.

The current UI is intentionally a prototype: quick notes and commitments are surfaced in the capture view but are not yet persisted. Those are part of the next capture/closeout slice.
