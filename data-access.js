const STORAGE = {
  sessions: 'rsm-sessions',
  queue: 'rsm-sync-queue',
  audit: 'rsm-audit-log'
};

const id = () => globalThis.crypto?.randomUUID?.() || `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export class CuratedRepository {
  async loadSessions() {
    const cached = read(STORAGE.sessions, null);
    if (cached) return cached;
    const response = await fetch('data/curated.json');
    if (!response.ok) throw new Error(`Curated dataset unavailable (${response.status})`);
    const data = await response.json();
    write(STORAGE.sessions, data.sessions);
    return data.sessions;
  }

  saveSessions(sessions) { write(STORAGE.sessions, sessions); }

  queueMutation(mutation) {
    const queue = read(STORAGE.queue, []);
    queue.push({ ...mutation, id: id(), queuedAt: new Date().toISOString() });
    write(STORAGE.queue, queue);
    return queue;
  }

  getQueue() { return read(STORAGE.queue, []); }
  clearQueue() { write(STORAGE.queue, []); }

  appendAudit(entry) {
    const audit = read(STORAGE.audit, []);
    audit.push({ ...entry, id: id(), timestamp: new Date().toISOString() });
    write(STORAGE.audit, audit);
  }

  getAudit() { return read(STORAGE.audit, []); }
}

// The live provider will implement the same contract against Dataverse Web API.
// Keeping the provider boundary here lets R1 run entirely on the governed export.
export function createRepository() {
  return new CuratedRepository();
}
