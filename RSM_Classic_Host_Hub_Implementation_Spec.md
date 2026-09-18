# RSM Classic Host & Hub Experience

**Implementation Specification — Final Draft — September 2026**

Build requirements for the host-facing companion and the Hub arrival, conversation and capture experience at the November Classic. Written for the technical team.

| | |
|---|---|
| **Event** | November 2026, Sea Island |
| **Build window** | 9 weeks |
| **Release 1 screens** | 9 |
| **Client orgs in scope** | ~25–35 |
| **Session length** | 30–60 min + 15 min reset |

---

## 1. Purpose and scope

The RSM Classic Hub turns a hospitality event into a structured business conversation. The software exists to support two groups of people: **host leaders**, who own the client relationship across the whole event, and the **Hub team**, who receive the client at the Hub and run the curated session.

The governing design principle: **the client-facing experience stays natural because the backstage orchestration is deliberate.** The platform is backstage. A client should never see it, and a host should never appear to be consulting it mid-conversation.

The stated success measure is not whether the client enjoyed the golf. It is whether the client left **more connected to RSM, more understood by their account team, and more confident RSM can help with what comes next.** Every requirement here traces to that sentence.

### 1.1 In scope

- Host preparation, briefing, in-event support and daily coordination
- Hub arrival and check-in at the Hub location
- Guided session delivery — welcome, calibrate, curated path, dialogue, close
- Consent-gated conversation capture and session closeout
- The data model, integrations and governance supporting the above

### 1.2 Out of scope for this specification

- Guest-facing mobile app (attendee self-service agenda, experience discovery)
- Leadership and steering-committee dashboards
- Post-event follow-up workbench and CRM opportunity creation
- Event-wide registration and badging, handled by the existing event check-in application

These are specified elsewhere in the wider platform architecture. The data model in §7 accommodates them so they can be added without schema rework.

### 1.3 Release markers

- **R1** — build for the November Classic
- **R2** — specified, deferred to the next release
- **Dependency** — requires action outside the development team by a stated date

---

## 2. The experience model

### 2.1 Two journeys

The host journey spans six weeks before the event to two weeks after. The Hub visit is a 60-minute experience inside it. The software supports both, and they have different rhythms: the host journey is episodic and mostly asynchronous; the Hub visit is continuous, timed and unforgiving.

`Invited → Prepared → Welcomed → Connected → Understood → Followed up → Relationship advanced`

### 2.2 Hub session types and capacity rules

These are scheduling constraints the platform enforces, not merely displays.

| Type | Duration | Audience | Constraint |
|---|---|---|---|
| Standard Platinum visit | 30–60 min + 15 min reset | One client organization, 2–6 participants | Private reservation; one organization at a time |
| Platinum Surround | 90–120 min | Highest-priority relationship | Maximum one fully private surround per day |
| Micro-cohort | 30–60 min | Up to two client organizations | Only where a shared strategic issue exists *and* both relationship leads agree |
| Reserve capacity | 15–20% of schedule | — | Held for extensions, late arrivals, executive changes |

### 2.3 The 75-minute Hub cadence

Hub screens are organised around this sequence, because it is what the team is living through. The active stage drives what the interface surfaces.

| Time | Activity |
|---|---|
| T−30 | SME prep — review dossier, confirm route, ready examples |
| T−10 | Arrival ready — concierge, preferred beverage, host in position |
| 0–5 | Welcome — greet by name, orient, confirm consent |
| 5–10 | Calibrate — confirm the business priority, adjust route |
| 10–25 | Curated path — 1–3 relevant areas only |
| 25–50 | Dialogue — seated, tailored discussion with the right experts |
| 50–60 | Commit — takeaways, owners, next step |
| +15 | Debrief and reset — validate draft, assign actions, restore room |

### 2.4 Roles

Six roles operate the experience. These are the security principals — access control is modelled on them, not on job titles.

| Role | Owns | Primary surface |
|---|---|---|
| **Relationship Lead** | Invitation purpose, client context, the conversation, final follow-through | Host companion |
| **Host Leader** | The client relationship across the event; personal welcome and introductions | Host companion — mobile |
| **Gallery Concierge** | Hub arrival, hospitality, privacy, timing, physical environment | Hub arrival console — tablet |
| **Gallery Curator** | Client-specific route design and seamless transitions between zones | Hub session view — tablet |
| **Subject Matter Lead** | Hypotheses, examples and questions; joins when they add value | Hub session view — read-mostly |
| **Insight Steward** | Consent, approved capture, summary quality, action assignment, system-of-record updates | Capture and closeout — elevated permissions |

> **The Insight Steward is a required appointment, not a nice-to-have.**
> This role is the human-in-the-loop that every guardrail in §9 depends on. It owns consent, validates the AI-drafted summary, separates the client-safe recap from the internal brief, and assigns action owners. In R1 the role is served by elevated permissions on Conversation Capture and Session Closeout rather than a dedicated console. A named person must hold it before the event.

---

## 3. Host experience requirements

### 3.1 Stage-by-stage information contract

This table is the primary build reference for the host companion. It specifies what the host needs at each stage, what backstage does to support it, and what counts as success. Build the screens to deliver these payloads at these times.

| Stage | Information the host needs | Backstage support | Success measure | Screen |
|---|---|---|---|---|
| **1. Prepare**<br>4–6 wks before | Current company and role; industry and location; recent news; relationship history; RSM services held; business priorities; strategic opportunities; purpose of invitation; client interests; host contact details | Assign clients to hosts; provide attendee list; prepare event logistics; share account and relationship context | Host is prepared; personalized outreach completed; initial expectations set | My Clients (R2) |
| **2. Plan connections**<br>1–2 wks before | Conversation guide; suggested questions; key talking points; other RSM leaders attending; clients they should meet; schedule and logistics | Run host briefing; align account teams; map relevant specialists and peer connections | Clear host plan; targeted introductions identified; responsibilities coordinated | Client Host Brief |
| **3. Arrival and welcome**<br>Day of arrival | Arrival times; transportation plan; hotel and check-in information; dress guidance; itinerary; host mobile contact | Transportation; check-in; hospitality desk; arrival coordination; guest support | Seamless arrival; no confusion; personalized welcome delivered | Host Dashboard — logistics panel |
| **4. Curate the experience**<br>During the event | Client interests; key priorities; relevant specialists; peer matches; conversation prompts | Coordinate executive availability; support introductions; monitor hospitality flow | One relationship-strengthening conversation; two valuable introductions; one clear insight; one agreed next step | Client Host Brief |
| **5. Coordinate and capture**<br>End of each day | Debrief template; account owner; follow-up commitments; notes log | Capture notes centrally; prevent duplicate follow-up; assign next actions | Insights captured; follow-up owner assigned; account team aligned | Daily Debrief |
| **6. Follow through**<br>Within 48 hrs | Follow-up plan; accountable owner; next-best action; target timing | Schedule executive follow-up; specialist introductions; workshop requests; materials | Thank-you sent; meeting scheduled; materials shared; momentum maintained | Recap queue (R2) |
| **7. Measure outcomes**<br>Within 2 wks | Attendance; executive connections made; insights uncovered; opportunities identified or advanced; relationship risks addressed; client feedback; follow-up completion | Consolidate event outcomes into dashboard and reporting | Relationship advanced; meetings created; opportunities influenced; lessons captured | Outcome dashboard (R2) |

### 3.2 The Client Host Brief

The single most important artifact in the system. **Limited to one page**, with deeper detail behind links. The one-page constraint is a hard design requirement — it is what makes the brief usable in the ninety seconds before a client walks in. Build it to fit one phone screen plus one scroll.

| Category | Content | Release |
|---|---|---|
| Client profile | Company, role, location, industry, business priorities, recent news | R1 |
| Relationship history | Current RSM services, length of relationship, account team, key past interactions | R1 |
| Strategic opportunities | Growth priorities, transformation initiatives, potential needs, relevant RSM capabilities | R1 |
| Purpose of invitation | Why this client was invited and the desired relationship outcome | R1 |
| Client interests | Golf interest, hobbies, food preferences, spouse or guest information, personal connection points | R1 |
| RSM connections | Executives, specialists or peers to meet — drawn from both the RSM directory and the attending client list | R1 |
| Conversation guidance | Suggested questions, relevant insights, **topics to avoid** | R1 |
| Event details | Arrival time, transportation, accommodations, dress, itinerary, host contact | R1 |
| Follow-up plan | Accountable owner, next-best action, timing | R1 |

> **Two fields need restricted handling.**
> **Topics to avoid** is visible to the assigned host and Relationship Lead only, never to the wider team, and must never be surfaced by any generated summary.
> **Spouse and guest information** is personal data about someone who is not an RSM client and has consented to nothing. Collect the minimum, restrict to concierge and host, and apply a short retention clock with automated deletion.

### 3.3 Introductions have two pools

The introduction planner draws from the RSM directory *and* the attending client list. Client-to-client peer matching is a distinct feature from specialist routing and is the higher-value one: a CFO who meets a peer facing the same problem gets something RSM cannot manufacture.

This creates a cohort dependency. Peer matching only works if dossiers are reasonably complete across all attending clients, not just for the host's own. Dossier completeness must therefore be tracked and visible before the event, and a host who skips preparation degrades another host's session, not only their own.

---

## 4. Hub experience requirements

### 4.1 Functional requirements

The Hub solution has twelve jobs to be done. Each is listed with the data it requires.

| Job | Data required | Release |
|---|---|---|
| Pull up the client's record on demand | Client identity and profile; CRM account ID; relationship tier; services held; prior interactions and notes; stated preferences | R1 |
| Prep client-specific context ahead of the session | Priorities, goals, known pain points; recent activity and trigger events; meeting purpose; industry context; content tagged to those interests | R1 |
| Open with a personalized "here's what we know" view | Curated profile summary; key talking points; confirmed-versus-to-verify flags on each field; last contact date and outcome; presentation-ready display fields | R1 |
| Capture permission to record | Consent status; timestamp and who captured it; recording scope; consent type by jurisdiction; retention reference; audit record | R1 |
| Collect missing context during welcome | Required-versus-present field gap list; newly captured attributes; source of each value (client-stated or inferred); update timestamps | R1 |
| Run a guided conversation path | Path templates and step definitions; rules mapping client context to a path; current stage and step state; completion status per step | R1 |
| Listen and capture live | Audio and transcript; extracted topics and insights; action items and next steps; timestamps and confidence scores; mapping of extracted items to profile fields | R1 |
| Keep the planned path primary | Original planned sequence; queue of suggestions with state (accepted, deferred, dismissed); flags distinguishing planned steps from surfaced ones | R1 |
| Summarize and send the recap | Session summary and key points; decisions; action items with owners; agreed next steps; delivery channel and contact; template; send status | R1 |
| Recommend additional relevant areas | Catalog of topics, areas and offers; relevance and eligibility rules; client signals activating a recommendation; recommendation history | R2 |
| Schedule follow-ups and next steps | Proposed meeting details; attendee list; calendar availability; meeting links; reminder schedule; booking status | R2 |
| Nurture — remind, recall, recommend | Prior-conversation summary; open actions and status; reminder cadence; recommended next actions; touchpoint history; contact preferences | R2 |

### 4.2 Hub check-in and arrival

Hub check-in is a distinct moment from event registration, and the two must not be conflated in the build.

| | Event registration check-in | Hub arrival check-in |
|---|---|---|
| **Where** | Event registration desk | The Hub location, at the start of a booked session |
| **When** | Once, on arrival at the Classic | Every Hub session, at T−10 to T−0 |
| **Purpose** | Confirm attendance, issue badge | Activate the session; trigger the welcome; confirm participants and consent |
| **Built by** | Existing event check-in application | This build |

**Interface between them:** event check-in writes arrival status and timestamp to the shared Dataverse record. The Hub arrival console reads it to distinguish an on-site guest from one who has not yet arrived at the venue.

#### Hub arrival console — required behaviour

- Display the day's sessions in cadence order with reset buffers rendered as blocked time, not whitespace.
- At T−30, surface the session as prep-ready with the dossier and planned route one tap away.
- At T−10, present the arrival card: expected participants, preferred name pronunciation where captured, preferred beverage, accessibility or assistance needs, assigned host and Relationship Lead, and the room state.
- Confirm which of the expected participants actually arrived, and allow adding an unexpected attendee with minimum fields and duplicate detection.
- **Fire an arrival alert to the assigned host's device** on check-in. This is the mechanism behind "we expected you" and is the single most visible feature to the client.
- Capture or confirm recording consent before the session opens. If consent is declined, the session proceeds with capture disabled and no degradation of the experience.
- Record the session state transition so the Hub session view activates for the curator, facilitator and SME lead.

> **Arrival is the moment the whole system justifies itself.**
> Everything upstream — dossier assembly, validation, logistics — exists so that a named person can greet a client by name, with their preferred beverage, and reference why they were invited. Build the arrival path first and make it the most reliable thing in the application. If one feature must work offline flawlessly, it is this one.

### 4.3 Guided path and calibration

- The planned route is authored before the session and consists of one to three zones selected against the client's priorities.
- At calibration (5–10 min), the host confirms today's priority. Where it differs from the planned assumption, the route can be adjusted and the change is recorded with the client-stated priority marked as its source.
- The current step, the completion state and the actual zones visited are captured as the session proceeds.
- Suggested additions queue for human decision and are visually distinguished from planned steps. The planned path always remains primary — the system augments the route and never overrides it.
- Suggestion disposition (accepted, deferred, dismissed) is recorded.

### 4.4 Session closeout

Closeout produces **two distinct outputs**, and the split is a structural feature of the screen rather than a toggle someone remembers to set.

- **Client-safe recap** — discussion themes and commitments. Contains no internal opportunity language, no sensitivities, no speculation.
- **Internal brief** — opportunities, risks, relationship sensitivities, signals and recommended next actions.

Neither leaves the system without explicit human approval. A completeness check runs before closeout can be submitted: every commitment has an owner and a date, and the client-safe flag is set on every item destined for the client.

---

## 5. Screen specifications

### Release 1 screens

| Screen | Role | Device | Key components |
|---|---|---|---|
| **Host Dashboard** | Host Leader, Relationship Lead | Mobile | Today's assigned clients in cadence order; arrival alerts; invitation purpose; readiness flag; logistics panel (arrival time, flight, transportation, hotel, dress, itinerary, host mobile contact) |
| **Client Host Brief** | Host Leader, Relationship Lead | Mobile, tablet | The nine categories in §3.2, one page; source and confidence on every fact; restricted fields role-gated; deeper profile behind links |
| **Post-Interaction Capture** | Host Leader | Mobile | Voice note; key insight; commitment; referral or introduction made; urgency; assign to Relationship Lead; privacy level |
| **Daily Debrief** | All host and Hub roles | Tablet, desktop | Day's sessions; captured comments; new priorities; promised materials; relationship concerns; unassigned actions; **one named owner per client**; duplicate-follow-up detection |
| **Hub Arrival Console** | Gallery Concierge | Tablet, kiosk | Session schedule with reset buffers; arrival card; participant confirmation; unexpected-attendee capture with duplicate check; consent capture; arrival alert trigger; room state |
| **Hub Session View** | Gallery Curator, SME Lead | Tablet | Today's sessions; participant cards; session type; readiness flag; assigned host; planned route; dossier shortcut; cadence timer |
| **Live Client Dossier** | Curator, SME Lead, Relationship Lead | Tablet, board companion | Full profile; confirmed-versus-to-verify flags; talking points; planned path; gap list for missing context; source and confidence labels; privacy banner |
| **Conversation Capture** | Insight Steward, Facilitator | Tablet | Consent gate; voice capture and transcript; quick notes; topic and station tags; pain points; priorities; buying signals; commitments; quotes with approval flag; timestamps |
| **Session Closeout** | Insight Steward, Relationship Lead | Tablet | Generated draft; editable outcomes; commitments with owners and dates; two-output split; client-shareable toggle; completeness check; submit for approval |

---

## 6. Design decisions

Decisions already taken. Implement as stated.

| Area | Decision | Rationale |
|---|---|---|
| Sentiment analysis | **Not implemented.** No sentiment scoring, no emotional inference, no personality typing of any client or attendee. | Capture what the client said and who validated it. Inferred emotional state carries reputational risk with negligible operational value. |
| Security model | Modelled on the **six operating roles** in §2.4, not on job titles or the broader platform persona set. | The roles reflect who is actually in the room and who is accountable for each data class. |
| Scale | Built for **25–35 client organizations** and their sessions, not the full Classic attendee population. | The Hub receives one organization at a time. Designing the host UI around a thousand-row list degrades it for the sessions that matter. |
| Financial and transaction data | **Excluded from R1.** No net services by line of business, no three-year revenue, no transaction values. Optionally include `12–36 month transaction horizon: yes / no / unknown` with no value attached, behind an explicit role check. | Highest-sensitivity data class in the model, carried on mobile devices at a public venue. The host conversation does not require it. |
| CRM write-back | **Read-only in R1.** Captured intelligence lands in Dataverse with a CRM record link. No opportunity or lead creation from within the application. | Bidirectional sync under time pressure is the most common failure mode in this class of build. |
| Event check-in | **Not rebuilt.** Integrate with the existing event check-in application via a shared Dataverse table. Hub arrival check-in is separate and in scope. | Avoids duplicate build and conflicting arrival records. See §4.2. |

---

## 7. Data model

### 7.1 Layers and sensitivity

| Layer | Contents | Sensitivity |
|---|---|---|
| Customer profile | Identity, organization, contact, relationship, segmentation, strategic and personal context | Moderate — licensed data, provenance required |
| Event orchestration | Arrival, transportation, accommodation, attendance, schedule, session participation | Restricted — personal logistics, retention limits |
| Conversation intelligence | Notes, transcripts, pain points, buying signals, desired outcomes, risks | High — consent-gated, restricted retention |
| Relationship intelligence | Introductions made, executive connections, engagement, sponsors | Moderate — evidence-based only, no subjective scoring of people |
| Opportunity intelligence | Potential needs, service area, urgency, confidence, owner, next step | High — no CRM creation without human approval |

### 7.2 Entities

Build all fifteen in the schema even where R1 touches a subset. Retrofitting entities into a live event dataset is worse than carrying unused tables.

| Entity | Key fields | Release |
|---|---|---|
| `Account` | Account ID; industry; sector; segment; form of organization; employee count; current services; owner | R1 |
| `Contact` | Contact ID; name; preferred name; title; role; organization; preferences; LinkedIn | R1 |
| `Visit` | Visit ID; purpose of invitation; desired outcome; session type; status; host; timing; planned path | R1 |
| `EventLogistics` | Arrival ETA; airline and flight; pickup owner; accommodation and check-in; dress guidance; itinerary; host mobile contact; venue check-in status | R1 |
| `Guest` | Spouse or guest details; preferences; short-retention flag | R1 |
| `Consent` | Status; scope; timestamp; captured by; jurisdiction; retention reference | R1 |
| `Session` | Session ID; notes; transcript; participants; topic and station tags; facilitator; host; cadence state | R1 |
| `JourneyStep` | Step; zone; sequence; planned versus suggested; completion; timestamps | R1 |
| `Insight` | Type; client wording; source; confidence; validator; as-of date | R1 |
| `RelationshipInteraction` | People connected; pool (RSM or peer); topic; outcome; next action | R1 |
| `Action` | Action; owner; due timing; status; client-safe flag; source session | R1 |
| `ContentAsset` | Asset ID; topic tags; approval status; version; device compatibility | R2 |
| `Recommendation` | Type; rationale; status; accepted, deferred or dismissed; owner | R2 |
| `OpportunityCandidate` | Need; service; urgency; owner; disposition | R2 |
| `Measure` | Connections; insights; recap turnaround; action completion | R2 |

### 7.3 Provenance

Every enriched field carries **source**, **as-of date**, **confidence**, and **validator** where a human confirmed it — stored alongside the value and surfaced in the UI. A host who repeats a stale or inferred fact to a client executive damages the relationship, and visible provenance at the point of use is the only defense.

The interface distinguishes three states on every fact: **confirmed** (validated by a named human), **to verify** (from a source system, unvalidated), and **client-stated** (captured in conversation, in the client's own words). These drive different conversational moves and must be visually distinct.

---

## 8. Integrations

| Source | Provides | Access route | Status |
|---|---|---|---|
| Dataverse — Accelerator dev | Platform data layer | Provisioned | Available |
| Event check-in application | Venue arrival status and timestamp | Shared Dataverse table — contract required | Dependency, wk 1 |
| Dynamics 365 / CRM | Accounts, contacts, activities, owners, current services | Read-only connection | Dependency, wk 1 |
| Event registration | Invitation status, RSVP, guests, arrival, transport, accommodation | Export or connector | Dependency, wk 1 |
| PitchBook API | Firmographics, ownership, transactions, family tree | Via ISA | Dependency, wk 1 |
| Existing dossier collection | Company dossiers already assembled internally | Assess for reuse in week 1 | R1 |
| Entra ID | Authentication and role assignment | Standard | R1 |
| Content library | Approved stories, demos, diagnostics, takeaways | SharePoint metadata | R2 |
| Revenue system | Net services by line of business | — | R2 |

### 8.1 External enrichment

External augmentation of the client record is limited to three categories:

- **Recent trigger events** — company news, transactions and leadership changes in the trailing 90 days, summarized with source attribution and link.
- **Firmographics** — revenue, employee count, form of organization, family-tree entity count, each with an as-of date.
- **Professional profile** — title, tenure in role, board seats, prior organizations. Public professional data only.

Nothing scraped. Nothing personal beyond the professional record. Every item attributed and dated. If a source cannot be attributed, it does not appear in the dossier.

### 8.2 Configurable data source

The application runs identically against a **curated dataset** and against **live integrations**, switched by configuration. The data access layer is abstracted behind an interface; the curated path loads from a governed export maintained by the event team.

Build the curated path first and the live integrations second. With 25–35 organizations in scope the curated path is viable as a primary plan, and it is the mechanism by which the November date is protected regardless of integration timing.

---

## 9. Capture process and guardrails

### 9.1 The six-step capture process

1. **Consent and tag** — confirm permission for assisted notes or transcription; record participants, visit purpose and selected zones.
2. **Capture in context** — segment notes by topic or station; capture client language, questions, priorities, commitments and relationship signals.
3. **Generated draft** — internal summary with priorities, opportunities, risks, recommended actions, owners and dates.
4. **Human validation** — Relationship Lead and SME correct nuance, remove speculation, approve what is retained.
5. **Two outputs** — client-safe recap and internal brief, structurally separated.
6. **Distribute and track** — share with the Relationship Lead and appropriate contacts; update the system of record; track completion.

Steps 4 and 5 are where implementations commonly cut corners. They are the reason the system is trustworthy.

### 9.2 Guardrails

- **Approved RSM tools only.** No third-party transcription services.
- **Consent gates capture.** Where consent is not recorded as granted, voice capture is disabled in the interface — not discouraged. A no-recording path must always be available and must complete the session normally.
- **Grounded generation only.** Generated content draws from the approved dossier and session record. No open web retrieval, no model-memory facts about the client. Where the dossier does not contain something, the response states that it is not known.
- **No inference about people.** No sentiment, personality typing, emotional state or inferred motive. See §6.
- **The planned path stays primary.** Suggestions queue for human decision with recorded disposition and are visually distinguished from planned steps.
- **Human approval before anything reaches a client.** No automatic sending under any condition.
- **No system-of-record writes from a model.** Candidates stage in Dataverse; a named human converts them. Enforce architecturally, not by policy.
- **Rationale always visible** on every recommendation, with accept, edit and reject controls.
- **Minimize sensitive data** and apply the approved retention policy to transcripts, location data, personal logistics and guest details.

---

## 10. Architecture

Recommended approach is a **hybrid**: Dataverse as the data, governance and integration spine — shared with the existing event check-in application — and a responsive web application as the host and Hub front end, reading and writing through the Dataverse Web API.

**Why hybrid**

- Governance, audit, role-based access and CRM proximity live in Dataverse, which is what security review assesses and what check-in already writes to.
- Offline resilience, outdoor usability and interaction fidelity live in the front-end layer, which is the only place they can be achieved.
- R2 reporting sits directly over the same data with no migration.

**Cost and alternative**

- Requires two skill sets and an API contract between layers.
- A full Power Platform implementation is defensible given the reduced scale, and removes the second skill set.
- The deciding factor is offline behaviour on the host device. Prove it in week 2 rather than debating it.

---

## 11. Non-functional requirements

### Connectivity

- **Offline-first for all host and Hub screens.** Sea Island is a coastal property, event-week congestion degrades cellular further, and the moments that matter most are the least connected. Dossiers cache locally at session start.
- Captured notes, insights and commitments queue locally and sync on reconnection with visible sync state. Never silently discard a capture.
- Conflict resolution: last-write-wins for logistics, append-only for captured intelligence. Never overwrite a note.
- Arrival alerts degrade gracefully — if push cannot be delivered, the host dashboard surfaces the arrival on next foreground.

### Device and environment

- Phone and tablet as first-class targets. Hosts use phones while moving; the Hub team uses tablets.
- One-handed phone operation with primary actions in thumb reach.
- **Outdoor legibility.** High contrast, 16px minimum body text, no thin weights, no low-contrast grey. Validate outdoors in daylight.
- Eight-hour battery day. No continuous polling, no background location tracking.
- Intune provisioning with remote wipe. Devices carry client intelligence around a public venue.
- **Discretion.** The client must not see a host consulting a dossier mid-conversation. Glanceable layout, large touch targets, no notification sounds, and a fast path to a neutral screen.

### Performance

- Dossier opens in under two seconds from cache.
- Client search returns in under 500ms.
- Voice capture begins within one second of tap.
- Arrival alert reaches the host device within ten seconds of Hub check-in when connected.

### Accessibility

- WCAG 2.2 AA — keyboard operable, visible focus, labelled controls, 44px touch targets, reduced motion and system text sizing respected.

### Security

- Entra ID authentication with MFA; role-based access on the six operating roles.
- Field-level access control for topics to avoid, relationship risks, guest details and any financial data.
- Full audit trail on every dossier read and every intelligence write.
- Defined retention with automated deletion for transcripts, location data, personal logistics and guest details.
- Session timeout and local encryption at rest on device.

---

## 12. Delivery plan

| Week | Milestone | Gate |
|---|---|---|
| Wk 0 | Architecture decision locked. Team engaged. CRM, registration and PitchBook access requested. Insight Steward named. | Architecture decision |
| Wk 1 | Dataverse schema built. Check-in table contract agreed with the event check-in team. Existing dossier collection assessed for reuse. Client organization list confirmed. | Schema reviewed |
| Wk 2 | Data access layer abstracted. Curated dataset structure defined; first five dossiers loaded. Offline approach proven on a real device. | Schema frozen. Offline go / no-go |
| Wk 3–4 | Host Dashboard, Client Host Brief and Post-Interaction Capture against curated data. Six-role auth working. Brief fits one page. | Demoable on real devices |
| Wk 5 | Hub Arrival Console and arrival alert path end to end. Hub Session View and Live Client Dossier. | Arrival path reliable offline |
| Wk 6 | Conversation Capture with consent gate. Session Closeout with two-output split. Daily Debrief. | Feature complete |
| Wk 7 | **On-site rehearsal at Sea Island.** Real devices, real connectivity, real daylight, full dossier set, check-in integration tested end to end, a full session run at cadence. | Go / no-go on live integrations |
| Wk 8 | Code freeze. Devices provisioned. Host, concierge and Insight Steward training. Fallback procedures documented and rehearsed. | Freeze is absolute |
| Event week | On-site support. Daily debrief and completeness check each evening. | — |

> **Week 7 is the most important line in this plan.**
> An on-site rehearsal at the actual venue, on the actual devices, in actual daylight, is the highest-value item on the schedule. Event software fails on connectivity, glare and battery, none of which are visible from a desk. Protect that week even if it costs a feature.

---

## 13. Acceptance criteria

1. A host opens the app on a phone with no network connection and sees their assigned clients for the day with arrival time, flight, transportation, hotel, dress guidance and itinerary.
2. A host taps a client and the Client Host Brief renders in under two seconds, fits one page, and shows source and confidence on every enriched fact.
3. Topics to avoid are visible to the assigned host and Relationship Lead only, and never appear in any generated summary.
4. The introduction planner proposes both RSM specialists and attending-client peer matches, and a host can mark an introduction as made.
5. A concierge checks a client in at the Hub and the assigned host's device receives an arrival alert within ten seconds.
6. Hub check-in completes with no network connection and reconciles on reconnection without duplicating the arrival record.
7. Voice capture is disabled in the interface when consent is not recorded as granted, and a no-recording session completes normally.
8. A facilitator captures a note, an insight and a commitment offline; all three appear in Dataverse within sixty seconds of reconnecting.
9. A route change at calibration is recorded with the client-stated priority marked as its source, and the original planned path remains visible.
10. Session closeout produces two distinct outputs and neither sends without explicit human approval.
11. The completeness check blocks closeout where any commitment lacks an owner or a date.
12. The daily debrief shows one named owner per client for every open commitment, with unassigned items flagged.
13. Generated content answers a question the dossier does not cover by stating it is not known.
14. Every dossier read and intelligence write appears in the audit log with user, timestamp and record.
15. The application runs end to end against the curated dataset with all live integrations switched off.

---

## 14. Open items

| Item | Owner | By | Blocks |
|---|---|---|---|
| Architecture — hybrid or full Power Platform | Technology leadership | Wk 0 | All development |
| Name the Insight Steward | Program lead | Wk 0 | Consent and validation workflow |
| Confirm client organizations and session schedule | Program lead | Wk 1 | Curated dataset effort, capacity rules |
| Check-in table contract with the event check-in team | Development + event check-in owner | Wk 1 | Arrival alerts |
| PitchBook API access via ISA | Data owner | Wk 1 | Live enrichment only |
| CRM read connection and registration export | CRM and event owners | Wk 1 | Live data path |
| Reuse assessment of existing dossier collection work | Development | Wk 1 | Enrichment build or reuse |
| Client photograph source and consent basis | Marketing + legal | Wk 2 | Dossier and arrival card UI |
| Consent language and capture mechanism by jurisdiction | Legal + privacy | Wk 2 | Conversation Capture |
| Retention periods — transcripts, location, logistics, guest details | Privacy + data governance | Wk 3 | Launch approval |
| Zone definitions and planned-path templates | Gallery curator | Wk 4 | Guided path |
| Device fleet — count, ownership, Intune enrollment | Operations + IT | Wk 6 | Provisioning |

---

**Source material:** RSM Classic Client Host Journey service blueprint; Customer Experience — Accelerator @ Classic journey map; Journey Map (Classic) Accelerator in the Terrace Room service blueprint; RSM Classic Customer Data Enrichment Model; RSM Classic UI Persona, Screen and Data Map v3; data orchestration plan; RSM Accelerator and Data Journey deck; host and guest interface mockups.

Field-level data dictionary and full component catalog remain in the source workbooks and are referenced rather than reproduced here.
