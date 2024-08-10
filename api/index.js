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
app.use(express.static('public')); // To serve static files like images

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define schemas and models
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: String,
  email: { type: String, unique: true, required: true },
  linkedIn: String,
  workTitle: String,
  employer: String,
  jobTitle: String,
  profilePic: { type: String, required: false }, // URL to the image
  bio: String,
  lessonsPreferred: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CurriculumItem' }]
});

const curriculumItemSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Changed to Date type
  type: String,
  moduleName: String,
  lessonName: String,
  conceptsCovered: String,
  lessonPlanDueDate: { type: Date, required: true }, // Changed to Date type
  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to User model
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

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Curriculum Organizer API');
});

// User Registration
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
    console.error('Registration error:', error);
    res.status(400).send(error.message);
  }
});

// User Login
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
    console.error('Login error:', error);
    res.status(400).send(error.message);
  }
});

// Get Current User
app.get('/api/users/me', checkJwt, async (req, res) => {
  try {
    const user = await User.findById(req.auth.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(400).send(error.message);
  }
});

// Update Current User
app.put('/api/users/me', checkJwt, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.auth.id, req.body, { new: true }).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).send(error.message);
  }
});

// Get Curriculum Items
app.get('/api/curriculum', checkJwt, async (req, res) => {
  try {
    const curriculumItems = await CurriculumItem.find().populate('speakers');
    res.send(curriculumItems);
  } catch (error) {
    console.error('Get curriculum error:', error);
    res.status(400).send(error.message);
  }
});

// Request to Speak at a Lesson
app.put('/api/curriculum/:id', checkJwt, async (req, res) => {
  try {
    const item = await CurriculumItem.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('speakers');
    if (!item) {
      return res.status(404).send('Curriculum item not found');
    }
    websocket.broadcast({ type: 'UPDATE', data: item }); // Broadcast update via WebSocket
    res.send(item);
  } catch (error) {
    console.error('Update curriculum error:', error);
    res.status(400).send(error.message);
  }
});

// Serve Profile Pictures
app.get('/profile-pic/:filename', (req, res) => {
  res.sendFile(`/path/to/your/uploads/${req.params.filename}`, { root: '.' });
});

// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app;
