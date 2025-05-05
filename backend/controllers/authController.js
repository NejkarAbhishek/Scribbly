import { hash, compare } from 'bcrypt';
import { getUserProfile, registerUser } from '../controllers/userController.js';
import { generateToken } from '../config/jwt.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await getUserProfile({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const passwordHash = await hash(password, 10);
    const user = await registerUser({ name, email, passwordHash });
    const token = generateToken({ userId: user._id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await getUserProfile({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken({ userId: user._id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}