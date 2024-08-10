const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const websocket = require('./websocket'); // WebSocket integration
const { expressjwt: jwtMiddleware } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define schemas and models
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: String,
  title: String,
  company: String,
  experience: Number,
  bio: String,
  profilePic: String
});

const curriculumItemSchema = new mongoose.Schema({
  date: String,
  type: String,
  moduleName: String,
  lessonName: String,
  conceptsCovered: String,
  lessonPlanDueDate: String,
  speakers: [String],
  adminConfirmed: Boolean
});

const User = mongoose.model('User', userSchema);
const CurriculumItem = mongoose.model('CurriculumItem', curriculumItemSchema);

// Auth0 JWT middleware
const checkJwt = jwtMiddleware({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hashedPassword
    });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName } });
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/users/me', checkJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/api/users/me', checkJwt, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/curriculum', checkJwt, async (req, res) => {
  try {
    const curriculumItems = await CurriculumItem.find();
    res.send(curriculumItems);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/api/curriculum/:id', checkJwt, async (req, res) => {
  try {
    const item = await CurriculumItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    websocket.broadcast({ type: 'UPDATE', data: item }); // Broadcast update via WebSocket
    res.send(item);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Export the app and WebSocket server for Vercel
module.exports = app;
