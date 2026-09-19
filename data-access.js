const STORAGE = { sessions: 'rsm-sessions', queue: 'rsm-sync-queue', audit: 'rsm-audit-log' };
const id = () => globalThis.crypto?.randomUUID?.() || `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
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
    const queued = { ...mutation, id: mutation.id || id(), queuedAt: new Date().toISOString(), attempts: 0, status: 'pending' };
    if (!queue.some(item => item.id === queued.id)) queue.push(queued);
    write(STORAGE.queue, queue);
    return queued;
  }
  getQueue() { return read(STORAGE.queue, []); }
  acknowledgeMutation(mutationId) { write(STORAGE.queue, this.getQueue().filter(item => item.id !== mutationId)); }
  markMutationFailed(mutationId, error) { write(STORAGE.queue, this.getQueue().map(item => item.id === mutationId ? { ...item, attempts: item.attempts + 1, status: 'failed', lastError: String(error), lastAttemptAt: new Date().toISOString() } : item)); }
  // Kept for development reset only; production sync must acknowledge individual successes.
  clearQueue() { write(STORAGE.queue, []); }
  appendAudit(entry) { const audit = read(STORAGE.audit, []); audit.push({ ...entry, id: id(), timestamp: new Date().toISOString() }); write(STORAGE.audit, audit); }
  getAudit() { return read(STORAGE.audit, []); }
}

export function createRepository() { return new CuratedRepository(); }
