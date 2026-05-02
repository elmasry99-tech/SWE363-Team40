import express from 'express';
import bcrypt from 'bcryptjs';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { requireAuth } from '../middleware/auth.js';

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
    if (!name) return res.status(400).json({ error: 'name is required' });

    const organization = await Organization.create({ name, status, policies });
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
    if (req.user.role === 'oso' && req.user.orgId?.toString() !== req.params.id) return res.status(403).json({ error: 'Not authorized' });

    const { name, status, policies } = req.body;
    const update = {};
    if (name) update.name = name;
    if (status) update.status = status;
    if (policies) update.policies = policies;

    const organization = await Organization.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!organization) return res.status(404).json({ error: 'Organization not found' });

    await AuditLog.create({ actorId: req.user.id, action: 'org.update', target: organization._id.toString() });
    res.json({ organization });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
