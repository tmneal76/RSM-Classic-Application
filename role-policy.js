export const OPERATING_ROLES = Object.freeze([
  'Relationship Lead',
  'Host Leader',
  'Gallery Concierge',
  'Gallery Curator',
  'Subject Matter Lead',
  'Insight Steward'
]);

const FIELD_ACCESS = Object.freeze({
  topicsToAvoid: ['Relationship Lead', 'Host Leader'],
  guestDetails: ['Relationship Lead', 'Host Leader', 'Gallery Concierge'],
  relationshipRisks: ['Relationship Lead', 'Insight Steward'],
  financialData: []
});

export function canAccessField(role, field) {
  return Array.isArray(FIELD_ACCESS[field]) && FIELD_ACCESS[field].includes(role);
}

export function canCaptureIntelligence(role) {
  return role === 'Insight Steward' || role === 'Relationship Lead';
}

export function canApproveCloseout(role) {
  return role === 'Insight Steward' || role === 'Relationship Lead';
}

export function assertRole(role) {
  if (!OPERATING_ROLES.includes(role)) throw new Error(`Unsupported operating role: ${role}`);
  return role;
}

export { FIELD_ACCESS };
