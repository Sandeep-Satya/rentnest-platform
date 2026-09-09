import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/database';
import { generateToken, requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Register Customer
router.post('/register', (req: Request, res: Response): void => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required.' });
      return;
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
    }

    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const passwordHash = bcrypt.hashSync(password, 10);

    db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, ?, 'customer')
    `).run(id, name, email.toLowerCase(), phone || '', passwordHash);

    const user = { id, name, email: email.toLowerCase(), role: 'customer' as const };
    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// Login
router.post('/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as any;
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = generateToken(authUser);

    res.json({
      message: 'Login successful',
      token,
      user: authUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login.' });
  }
});

// Demo Login Switcher (for effortless evaluation)
router.post('/demo-login', (req: Request, res: Response): void => {
  try {
    const { role } = req.body; // 'admin' | 'customer'
    const targetEmail = role === 'admin' ? 'admin@rentconsult.com' : 'rahul@example.com';

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(targetEmail) as any;
    if (!user) {
      res.status(404).json({ error: 'Demo user not found. Please run db seed.' });
      return;
    }

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = generateToken(authUser);

    res.json({
      message: `Demo logged in as ${user.role}`,
      token,
      user: authUser
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: 'Demo login failed.' });
  }
});

// Get Current User Profile
router.get('/me', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

export default router;
