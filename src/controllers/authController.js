// Auth business logic
const { signToken } = require('../config/jwt');
const { createUser, findUserByEmail, comparePassword } = require('../models/userModel');

// AI Mock: Password strength feedback
const getPasswordFeedback = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const feedback = score < 3 ? 'Weak: Add uppercase, numbers, and symbols.' : 'Strong!';
  return { score, feedback };
};

const signup = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const feedback = getPasswordFeedback(password); // AI integration
    if (feedback.score < 2) return res.status(400).json({ error: 'Password too weak', feedback });

    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) return res.status(409).json({ error: 'Email exists' });

    const userId = await createUser({ ...userData, password });
    const user = await findUserByEmail(userData.email);
    const token = signToken({ id: user.id, email: user.email });

    res.status(201).json({ token, user: { id: user.id, email: user.email }, feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mock reset (send OTP via email in real)
const resetPassword = async (req, res) => {
  // Simulate OTP send
  res.json({ message: 'OTP sent to email (mocked)' });
};

module.exports = { signup, login, resetPassword };