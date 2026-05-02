import express from 'express';
import bcrypt from 'bcryptjs';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { requireAuth } from '../middleware/auth.js';
import {
  isNonEmptyString,
  isStrongPassword,
  isValidEmail,
  isValidObjectId,
  validatePolicies,
} from '../lib/validation.js';

const router = express.Router();

function requireRole(user, roles) {
  return roles.includes(user.role);
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    orgId: user.orgId,
    status: user.status,
  };
}

function serializePublicOrganization(organization) {
  return {
    id: organization._id,
    name: organization.name,
    status: organization.status,
  };
}

router.get('/public', async (_req, res) => {
  try {
    const organizations = await Organization.find({ status: 'active' }).sort({ name: 1 });
    res.json({ organizations: organizations.map(serializePublicOrganization) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    if (!requireRole(req.user, ['admin', 'oso'])) return res.status(403).json({ error: 'Not authorized' });
    const filter = req.user.role === 'oso' ? { _id: req.user.orgId } : {};
    const organizations = await Organization.find(filter).sort({ name: 1 });
    res.json({ organizations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    if (!requireRole(req.user, ['admin'])) return res.status(403).json({ error: 'Not authorized' });

    const { name, status, policies, officer } = req.body;
    if (!isNonEmptyString(name)) return res.status(400).json({ error: 'name is required' });
    if (status !== undefined && !['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'status must be active or suspended' });
    }

    const { updates: validatedPolicies, errors: policyErrors } = validatePolicies(policies || {});
    if (policyErrors.length) {
      return res.status(400).json({ error: policyErrors.join('; ') });
    }

    if (officer !== undefined) {
      if (!isNonEmptyString(officer?.name) || !isValidEmail(officer?.email) || !isStrongPassword(officer?.password)) {
        return res.status(400).json({
          error: 'officer.name, officer.email, and a strong officer.password are required',
        });
      }
    }

    const organization = await Organization.create({
      name: name.trim(),
      status,
      policies: validatedPolicies,
    });
    let officerUser = null;

    if (officer?.name && officer?.email && officer?.password) {
      const passwordHash = await bcrypt.hash(officer.password, 12);
      officerUser = await User.create({
        name: officer.name,
          email: officer.email,
          passwordHash,
          role: 'oso',
          orgId: organization._id,
          status: 'active',
      });
    }

    await AuditLog.create({
      actorId: req.user.id,
      action: 'org.create',
      target: organization._id.toString(),
      meta: officerUser ? { officerId: officerUser._id } : {},
    });

    res.status(201).json({
      organization,
      officer: officerUser ? serializeUser(officerUser) : null,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Duplicate organization or officer email' });
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/users', requireAuth, async (req, res) => {
  try {
    if (!requireRole(req.user, ['admin', 'oso'])) return res.status(403).json({ error: 'Not authorized' });
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid organization id' });
    if (req.user.role === 'oso' && req.user.orgId?.toString() !== req.params.id) return res.status(403).json({ error: 'Not authorized' });

    const users = await User.find({ orgId: req.params.id }).select('-passwordHash -publicKey').sort({ name: 1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    if (!requireRole(req.user, ['admin', 'oso'])) return res.status(403).json({ error: 'Not authorized' });
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid organization id' });
    if (req.user.role === 'oso' && req.user.orgId?.toString() !== req.params.id) return res.status(403).json({ error: 'Not authorized' });

    const { name, status, policies } = req.body;
    const update = {};
    if (name !== undefined) {
      if (!isNonEmptyString(name)) return res.status(400).json({ error: 'name must be a non-empty string' });
      update.name = name.trim();
    }
    if (status !== undefined) {
      if (!['active', 'suspended'].includes(status)) return res.status(400).json({ error: 'status must be active or suspended' });
      update.status = status;
    }
    if (policies !== undefined) {
      const { updates: validatedPolicies, errors: policyErrors } = validatePolicies(policies);
      if (policyErrors.length) {
        return res.status(400).json({ error: policyErrors.join('; ') });
      }

      const currentOrganization = await Organization.findById(req.params.id);
      if (!currentOrganization) return res.status(404).json({ error: 'Organization not found' });
      update.policies = {
        ...currentOrganization.policies.toObject(),
        ...validatedPolicies,
      };
    }

    const organization = await Organization.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    if (!organization) return res.status(404).json({ error: 'Organization not found' });

    await AuditLog.create({ actorId: req.user.id, action: 'org.update', target: organization._id.toString() });
    res.json({ organization });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
