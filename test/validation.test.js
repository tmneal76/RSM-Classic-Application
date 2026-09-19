import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateSession,
  validateCommitment,
  validateCloseout,
} from '../validation.js';

import {
  OPERATING_ROLES,
  FIELD_ACCESS,
  canAccessField,
  canCaptureIntelligence,
  canApproveCloseout,
  assertRole,
} from '../role-policy.js';

test('validateSession accepts a complete valid session', () => {
  const session = {
    id: 'session-1',
    organization: 'Northwind',
    sessionType: 'Site Visit',
    start: '2026-01-15T09:00:00Z',
    end: '2026-01-15T12:00:00Z',
    participants: ['Ava', 'Ben'],
    host: 'Host Leader',
    relationshipLead: 'Relationship Lead',
    route: ['Lobby', 'Gallery'],
    consent: { status: 'granted' },
  };

  assert.deepEqual(validateSession(session), { valid: true, errors: [] });
});

test('validateSession catches missing required fields and invalid structure', () => {
  const result = validateSession({
    id: 'session-2',
    organization: '',
    sessionType: 'Site Visit',
    start: '2026-01-15T09:00:00Z',
    end: null,
    participants: 'Ava',
    host: 'Host Leader',
    relationshipLead: 'Relationship Lead',
    route: 'Lobby',
    consent: { status: 'pending' },
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('organization is required'));
  assert.ok(result.errors.includes('end is required'));
  assert.ok(result.errors.includes('participants must be an array'));
  assert.ok(result.errors.includes('route must be an array'));
  assert.ok(result.errors.includes('consent.status must be granted or declined'));
});

test('validateCommitment requires text, owner, and dueDate', () => {
  const valid = validateCommitment({
    text: 'Review the vendor packet',
    owner: 'Maya',
    dueDate: '2026-01-20',
  });

  assert.deepEqual(valid, { valid: true, errors: [] });

  const invalid = validateCommitment({
    text: '   ',
    owner: '',
    dueDate: undefined,
  });

  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.errors, [
    'text is required',
    'owner is required',
    'dueDate is required',
  ]);
});

test('validateCloseout requires the recap and internal brief and explicit approval', () => {
  const valid = validateCloseout(
    {
      clientRecap: 'Client-safe recap',
      internalBrief: 'Internal brief',
      clientApproved: true,
      internalApproved: true,
    },
    [
      {
        text: 'Follow up on the route',
        owner: 'Alex',
        dueDate: '2026-01-25',
      },
    ],
  );

  assert.deepEqual(valid, { valid: true, errors: [] });

  const invalid = validateCloseout(
    {
      clientRecap: '',
      internalBrief: '',
      clientApproved: false,
      internalApproved: false,
    },
    [
      {
        text: '',
        owner: '',
        dueDate: null,
      },
    ],
  );

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes('client-safe recap is required'));
  assert.ok(invalid.errors.includes('internal brief is required'));
  assert.ok(invalid.errors.includes('client-safe recap requires approval'));
  assert.ok(invalid.errors.includes('internal brief requires approval'));
  assert.ok(invalid.errors.includes('commitment 1: text is required'));
  assert.ok(invalid.errors.includes('commitment 1: owner is required'));
  assert.ok(invalid.errors.includes('commitment 1: dueDate is required'));
});

test('OPERATING_ROLES contains the expected operating roles', () => {
  assert.deepEqual(OPERATING_ROLES, [
    'Relationship Lead',
    'Host Leader',
    'Gallery Concierge',
    'Gallery Curator',
    'Subject Matter Lead',
    'Insight Steward',
  ]);
});

test('role-policy field access and approval checks match the policy table', () => {
  assert.equal(canAccessField('Relationship Lead', 'topicsToAvoid'), true);
  assert.equal(canAccessField('Host Leader', 'topicsToAvoid'), true);
  assert.equal(canAccessField('Gallery Curator', 'guestDetails'), false);
  assert.equal(canAccessField('Gallery Concierge', 'guestDetails'), true);
  assert.equal(canAccessField('Insight Steward', 'relationshipRisks'), true);
  assert.equal(canAccessField('Host Leader', 'financialData'), false);

  assert.equal(canCaptureIntelligence('Insight Steward'), true);
  assert.equal(canCaptureIntelligence('Relationship Lead'), true);
  assert.equal(canCaptureIntelligence('Gallery Curator'), false);

  assert.equal(canApproveCloseout('Insight Steward'), true);
  assert.equal(canApproveCloseout('Relationship Lead'), true);
  assert.equal(canApproveCloseout('Host Leader'), false);

  assert.deepEqual(FIELD_ACCESS, {
    topicsToAvoid: ['Relationship Lead', 'Host Leader'],
    guestDetails: ['Relationship Lead', 'Host Leader', 'Gallery Concierge'],
    relationshipRisks: ['Relationship Lead', 'Insight Steward'],
    financialData: [],
  });
});

test('assertRole accepts valid roles and rejects invalid ones', () => {
  assert.equal(assertRole('Host Leader'), 'Host Leader');
  assert.equal(assertRole('Insight Steward'), 'Insight Steward');

  assert.throws(() => assertRole('Visitor'), {
    name: 'Error',
    message: 'Unsupported operating role: Visitor',
  });
});
