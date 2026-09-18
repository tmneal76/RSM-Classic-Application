# RSM Classic Application

Offline-first host and Hub experience for the RSM Classic.

## Current slice

The `feature/hub-arrival-vertical-slice` branch contains a curated-data Hub arrival workflow:

- Session schedule and reset-aware cadence display
- Participant presence confirmation
- Consent-gated recording state
- Offline persistence and queued mutations
- Audit entries for arrival activation
- Service-worker caching for the arrival path
- A repository boundary ready for Dataverse Web API integration

Open `index.html` from a local web server (ES modules and service workers require HTTP):

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Data and sync boundary

`data-access.js` defines the R1 repository contract. `CuratedRepository` is the governed export provider used now. A Dataverse provider should implement the same methods and be selected by configuration once the table contract and authentication details are available.

Queued mutations are intentionally not silently discarded. The current prototype clears them only at the explicit sync seam and reports how many are ready for the future Dataverse batch operation.

## Next build slice

Implement the Hub Session View and Live Client Dossier on the same repository contract, then add an authenticated Dataverse provider and server-side audit persistence.
