# RSM Classic Application

Offline-first host and Hub experience for the RSM Classic.

## Current slice

The `feature/hub-arrival-vertical-slice` branch contains the curated-data R1 experience:

- Hub arrival console with participant and consent capture
- Durable offline mutation queue and local audit log
- Hub Session View and Live Client Dossier
- Provenance labels and planned-route-primary workflow
- Offline insight and commitment capture
- Owner/date completeness validation
- Separate client-safe recap and internal brief with human approval
- Daily Debrief with open commitments and ownership gaps
- Role-policy, validation and production-hardening boundaries

Run locally with a web server because ES modules and service workers require HTTP:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Production boundary

`data-access.js` is the R1 repository contract. `CuratedRepository` is the governed export provider. The production provider must target the Dataverse Web API with Entra authentication, server-side role/field enforcement, idempotent mutation delivery, retries, partial-failure retention and server-side audit persistence.

See `SECURITY.md` for the remaining launch controls. The current sync seam must not be treated as production synchronization.
