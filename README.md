# RSM Classic Application

Offline-first host and Hub experience for the RSM Classic.

## Current slice

The `feature/hub-arrival-vertical-slice` branch contains:

- Curated-data Hub arrival console
- Participant presence and consent capture
- Durable offline mutation queue and local audit log
- Hub Session View with dossier, route and capture tabs
- Provenance labels for confirmed, to-verify and client-stated facts
- Offline insight and commitment capture
- Owner/date completeness validation
- Structurally separate client-safe recap and internal brief
- Explicit human approval before closeout submission
- Daily Debrief with open commitments, ownership gaps and insight roll-up

Run locally with a web server because ES modules and service workers require HTTP:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Scope boundary

`data-access.js` is the repository contract. `CuratedRepository` is the governed export provider used by R1. The next provider will target Dataverse Web API and must preserve append-only intelligence writes, idempotent mutations, role checks and server-side audit persistence.

The current sync seam reports queued mutations as ready for Dataverse. It must be replaced with authenticated, retryable, idempotent server synchronization before production use.
