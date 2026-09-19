# Security and production hardening notes

This branch is a curated-data prototype, not a production deployment. The following controls are deliberately represented in code boundaries but require the live platform before launch:

- `role-policy.js` defines the six operating roles and restricted field policy.
- `validation.js` provides client-side guard checks for session data, commitments and closeout outputs.
- `data-access.js` uses stable mutation IDs and per-mutation acknowledgement hooks. A live provider must call `acknowledgeMutation` only after a successful idempotent Dataverse operation; it must never clear the complete queue after a partial failure.
- Local storage is suitable only for the curated prototype. Production devices require encrypted storage, Intune provisioning and remote wipe.
- Client-side role checks are advisory. Entra claims and Dataverse/server-side field security must enforce authorization.
- The current prototype does not transmit queue entries. No live credentials or Dataverse endpoints belong in this static frontend.

Before event use, complete the threat model, consent/legal review, retention configuration, server audit design, offline conflict strategy, accessibility test pass and device rehearsal.
