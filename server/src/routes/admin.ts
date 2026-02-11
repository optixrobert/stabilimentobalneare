import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authorizeAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware: Require Admin Role
router.use(authorizeAdmin);

// GET /api/admin/users
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        establishmentSettings: {
          select: {
            name: true
          }
        },
        _count: {
          select: { umbrellaSpots: true, transactions: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req: AuthRequest, res) => {
  const id = req.params.id as string;
  
  // Prevent deleting yourself
  if (id === req.user?.userId) {
    res.status(400).json({ error: 'Cannot delete your own admin account' });
    return;
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', async (req: AuthRequest, res) => {
  const id = req.params.id as string;
  const { role } = req.body;

  if (id === req.user?.userId) {
    res.status(400).json({ error: 'Cannot change your own role' });
    return;
  }

  if (!['user', 'admin'].includes(role)) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

export default router;
