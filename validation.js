const REQUIRED_SESSION_FIELDS = ['id', 'organization', 'sessionType', 'start', 'end', 'participants', 'host', 'relationshipLead'];
const ALLOWED_CONSENT = new Set(['granted', 'declined']);

export function validateSession(session) {
  const errors = REQUIRED_SESSION_FIELDS.flatMap(field =>
    session?.[field] === undefined || session[field] === null || session[field] === ''
      ? [`${field} is required`]
      : []
  );
  if (session && !Array.isArray(session.participants)) errors.push('participants must be an array');
  if (session && !Array.isArray(session.route)) errors.push('route must be an array');
  if (session?.consent && !ALLOWED_CONSENT.has(session.consent.status)) errors.push('consent.status must be granted or declined');
  return { valid: errors.length === 0, errors };
}

export function validateCommitment(commitment) {
  const errors = [];
  if (!commitment?.text?.trim()) errors.push('text is required');
  if (!commitment?.owner?.trim()) errors.push('owner is required');
  if (!commitment?.dueDate) errors.push('dueDate is required');
  return { valid: errors.length === 0, errors };
}

export function validateCloseout(closeout, commitments = []) {
  const errors = [];
  if (!closeout?.clientRecap?.trim()) errors.push('client-safe recap is required');
  if (!closeout?.internalBrief?.trim()) errors.push('internal brief is required');
  if (!closeout?.clientApproved) errors.push('client-safe recap requires approval');
  if (!closeout?.internalApproved) errors.push('internal brief requires approval');
  commitments.forEach((item, index) => {
    const result = validateCommitment(item);
    result.errors.forEach(error => errors.push(`commitment ${index + 1}: ${error}`));
  });
  return { valid: errors.length === 0, errors };
}
