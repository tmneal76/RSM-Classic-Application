import { createRepository } from './data-access.js';

const repository = createRepository();
const state = { sessions: [], search: '', filter: 'all', pending: repository.getQueue() };
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char]));
const isArrived = session => session.status === 'arrived';
const announce = message => {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
};

function persist() {
  repository.saveSessions(state.sessions);
  state.pending = repository.getQueue();
  updateMetrics();
}

function updateMetrics() {
  $('#readyCount').textContent = state.sessions.length;
  $('#arrivedCount').textContent = state.sessions.filter(isArrived).length;
  $('#syncCount').textContent = state.pending.length;
  const next = state.sessions.find(session => !isArrived(session));
  $('#nextCountdown').textContent = next?.start || '—';
}

function render() {
  const query = state.search.toLowerCase();
  const sessions = state.sessions.filter(session => {
    const statusMatches = state.filter === 'all' || (state.filter === 'arrived' ? isArrived(session) : !isArrived(session));
    return statusMatches && (!query || session.organization.toLowerCase().includes(query));
  });
  $('#sessionList').innerHTML = sessions.length ? sessions.map(sessionCard).join('') : '<div class="empty">No sessions match this view.</div>';
  updateMetrics();
}

function sessionCard(session) {
  const arrived = isArrived(session);
  return `<article class="session-card"><div class="time">${escapeHtml(session.start)}<small>until ${escapeHtml(session.end)}</small></div><div class="session-main"><h2>${escapeHtml(session.organization)}</h2><p class="session-meta">${escapeHtml(session.sessionType)} · ${session.participants.length} expected participant${session.participants.length === 1 ? '' : 's'} · Host: ${escapeHtml(session.host)}</p><div class="chips">${session.route.map(zone => `<span class="chip">${escapeHtml(zone)}</span>`).join('')} ${arrived ? '<span class="chip arrived">Arrived</span>' : ''}</div></div><div class="session-action"><span class="status-label">${arrived ? 'Session activated' : 'Prep-ready'}</span><button class="button ${arrived ? 'secondary' : ''}" data-session="${session.id}">${arrived ? 'View arrival' : 'Check in'}</button></div></article>`;
}

function openArrival(id) {
  const session = state.sessions.find(item => item.id === id);
  if (!session) return;
  const arrived = isArrived(session);
  $('#modalRoot').innerHTML = `<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-header"><div><p class="eyebrow">${escapeHtml(session.start)} · ${escapeHtml(session.sessionType)}</p><h2 id="modalTitle">${escapeHtml(session.organization)}</h2><p class="muted">Assigned host: ${escapeHtml(session.host)} · Relationship Lead: ${escapeHtml(session.relationshipLead)}</p></div><button class="close" aria-label="Close">×</button></div><div class="arrival-card"><strong>Arrival details</strong><p>Preferred beverage: ${escapeHtml(session.preferredBeverage)}</p><p>Accessibility: ${escapeHtml(session.accessibility)}</p><p>Purpose: ${escapeHtml(session.purpose)}</p></div><h3>Participants present</h3><div>${session.participants.map(person => `<label class="participant"><span><p><strong>${escapeHtml(person.preferredName || person.name)}</strong></p><small>${escapeHtml(person.title)}</small></span><span class="check"><input type="checkbox" data-participant="${person.id}" ${person.arrived ? 'checked' : ''} ${arrived ? 'disabled' : ''}/> Present</span></label>`).join('')}</div>${!arrived ? '<div class="consent"><h3>Recording consent</h3><label><input id="consent" type="checkbox" /> Permission granted for assisted notes and transcription for this session</label><p class="muted">If declined, capture remains disabled and the session continues normally.</p></div>' : `<div class="consent"><h3>Consent status</h3><p class="muted">${session.consent?.status === 'granted' ? 'Consent granted for assisted notes and transcription.' : 'No recording consent. Capture remains disabled.'}</p></div>`}<div class="modal-actions"><button class="button secondary close">Cancel</button>${arrived ? '' : '<button class="button" id="activateButton">Activate session</button>'}</div></section></div>`;
  $('#modalRoot').querySelectorAll('.close').forEach(button => button.addEventListener('click', closeModal));
  if (!arrived) $('#activateButton').addEventListener('click', () => activateSession(session));
}

function activateSession(session) {
  if (isArrived(session)) return announce('This session is already active.');
  const selected = [...document.querySelectorAll('[data-participant]:checked')];
  if (!selected.length) return announce('Confirm at least one participant is present.');
  session.participants.forEach(person => { person.arrived = selected.some(input => input.dataset.participant === person.id); });
  session.status = 'arrived';
  session.arrival = { checkedInAt: new Date().toISOString(), checkedInBy: 'Gallery Concierge' };
  session.consent = $('#consent')?.checked
    ? { status: 'granted', scope: 'assisted-notes-and-transcription', capturedAt: new Date().toISOString(), capturedBy: 'Gallery Concierge' }
    : { status: 'declined', scope: 'none', capturedAt: new Date().toISOString(), capturedBy: 'Gallery Concierge' };
  const mutation = { type: 'session.arrival.activate', aggregateId: session.id, payload: { arrival: session.arrival, consent: session.consent, participants: session.participants } };
  repository.queueMutation(mutation);
  repository.appendAudit({ action: 'arrival.activate', recordType: 'Session', recordId: session.id, actor: 'Gallery Concierge', offline: !navigator.onLine });
  persist();
  closeModal();
  render();
  announce(session.consent.status === 'granted' ? 'Session activated · consent recorded · host alerted' : 'Session activated · no recording · host alerted');
  if (navigator.onLine) flushQueue();
}

function closeModal() { $('#modalRoot').innerHTML = ''; }

function flushQueue() {
  if (!navigator.onLine || !state.pending.length) return;
  const count = state.pending.length;
  // This is the sync seam: replace with Dataverse batch POST when the contract is available.
  repository.clearQueue();
  state.pending = [];
  updateMetrics();
  announce(`${count} queued update${count === 1 ? '' : 's'} ready for Dataverse sync`);
}

async function init() {
  try { state.sessions = await repository.loadSessions(); }
  catch { state.sessions = []; announce('Curated data could not be loaded.'); }
  render();
  $('#searchInput').addEventListener('input', event => { state.search = event.target.value; render(); });
  $('#filterSelect').addEventListener('change', event => { state.filter = event.target.value; render(); });
  $('#sessionList').addEventListener('click', event => { const button = event.target.closest('[data-session]'); if (button) openArrival(button.dataset.session); });
  $('#neutralButton').addEventListener('click', () => { document.body.classList.toggle('neutral'); announce('Neutral screen toggle ready for host discretion'); });
  window.addEventListener('online', () => { $('#connectionLabel').textContent = 'Connected'; $('#connectionDot').classList.add('online'); flushQueue(); });
  window.addEventListener('offline', () => { $('#connectionLabel').textContent = 'Offline-ready'; $('#connectionDot').classList.remove('online'); });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
}

init();
