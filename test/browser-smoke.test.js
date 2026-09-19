import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import { createRepository } from '../data-access.js';

function makeLocalStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

test('repository queues offline mutations and handles failed sync attempts', () => {
  globalThis.localStorage = makeLocalStorage();

  const repository = createRepository();
  const queued = repository.queueMutation({
    type: 'capture',
    payload: { id: 'p-1', sessionId: 's-101' },
  });

  assert.equal(queued.status, 'pending');
  assert.equal(repository.getQueue().length, 1);

  repository.markMutationFailed(queued.id, 'offline');
  const failed = repository.getQueue().find(item => item.id === queued.id);

  assert.equal(failed.status, 'failed');
  assert.equal(failed.attempts, 1);
  assert.match(failed.lastError, /offline/i);

  repository.acknowledgeMutation(queued.id);
  assert.deepEqual(repository.getQueue(), []);
});

test('service worker install and fetch flow work for cached app assets', async () => {
  const workerCode = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

  const cacheStore = new Map();
  const listeners = {};
  const self = {
    listeners,
    addEventListener(type, callback) {
      listeners[type] = callback;
    },
    skipWaiting() {
      self.skipCalled = true;
    },
    clients: {
      claim() {
        self.claimed = true;
      },
    },
  };

  const caches = {
    async open(name) {
      return {
        name,
        async addAll(list) {
          for (const item of list) cacheStore.set(item, { ok: true, url: item });
        },
      };
    },
    async match(request) {
      return cacheStore.get(request) ?? null;
    },
    async keys() {
      return ['legacy-cache', 'rsm-hub-v2'];
    },
    async delete(key) {
      if (key === 'legacy-cache') return true;
      return true;
    },
  };

  const installEvent = {
    waitUntil(promise) {
      this._waitUntil = promise;
      return promise;
    },
  };

  const fetchEvent = {
    request: '/index.html',
    respondWith(promise) {
      this._respondWith = promise;
      return promise;
    },
  };

  const context = {
    self,
    caches,
    fetch: async () => ({ ok: true, clone: () => ({}) }),
    console,
  };

  vm.runInNewContext(workerCode, context);

  listeners.install(installEvent);
  await installEvent._waitUntil;
  assert.equal(self.skipCalled, true);
  assert.equal(self.claimed, true);

  cacheStore.set('/index.html', { ok: true, url: '/index.html' });
  listeners.fetch(fetchEvent);
  const cachedResponse = await fetchEvent._respondWith;
  assert.deepEqual(cachedResponse, { ok: true, url: '/index.html' });
});
