const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Freelancer } = require('../models');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Freelancer.findOne({ where: { email } });
    if (exists) return res.status(400).json({ msg: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newFreelancer = await Freelancer.create({ name, email, password: hashed });

    res.status(201).json({ msg: 'Signup successful', user: newFreelancer });
  } catch (err) {
    res.status(500).json({ msg: 'Error in signup', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Freelancer.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ msg: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ msg: 'Error in login', error: err.message });
  }
};

module.exports = { signup, login };
