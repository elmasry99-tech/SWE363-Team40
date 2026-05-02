import mongoose from 'mongoose';

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function normalizeOptionalString(value) {
  return isNonEmptyString(value) ? value.trim() : null;
}

export function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isStrongPassword(value) {
  return typeof value === 'string' && /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(value);
}

export function isValidObjectId(value) {
  return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value);
}

export function parsePositiveInteger(value, fallback = null) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export function validatePolicies(policies = {}) {
  const updates = {};
  const errors = [];

  if (policies.fileSharing !== undefined) {
    if (typeof policies.fileSharing !== 'boolean') errors.push('policies.fileSharing must be a boolean');
    else updates.fileSharing = policies.fileSharing;
  }

  if (policies.screenSharing !== undefined) {
    if (typeof policies.screenSharing !== 'boolean') errors.push('policies.screenSharing must be a boolean');
    else updates.screenSharing = policies.screenSharing;
  }

  if (policies.guestAccess !== undefined) {
    if (typeof policies.guestAccess !== 'boolean') errors.push('policies.guestAccess must be a boolean');
    else updates.guestAccess = policies.guestAccess;
  }

  if (policies.retentionDays !== undefined) {
    const parsed = parsePositiveInteger(policies.retentionDays);
    if (!parsed || parsed > 3650) errors.push('policies.retentionDays must be an integer between 1 and 3650');
    else updates.retentionDays = parsed;
  }

  if (policies.sessionExpiry !== undefined) {
    const parsed = parsePositiveInteger(policies.sessionExpiry);
    if (!parsed || parsed > 3650) errors.push('policies.sessionExpiry must be an integer between 1 and 3650');
    else updates.sessionExpiry = parsed;
  }

  if (policies.messageRateLimit !== undefined) {
    const parsed = parsePositiveInteger(policies.messageRateLimit);
    if (!parsed || parsed > 1000000) errors.push('policies.messageRateLimit must be an integer between 1 and 1000000');
    else updates.messageRateLimit = parsed;
  }

  return { updates, errors };
}
