// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const authRoutes = require('../api/routes/authRoutes');
// const curriculumRoutes = require('../api/routes/curriculumRoutes');
// const userRoutes = require('../api/routes/userRoutes');
// const authenticateToken = require('../api/middleware/authenticateToken');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/curriculum', authenticateToken, curriculumRoutes);
// app.use('/api/users', authenticateToken, userRoutes);

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Catch-all route to serve your frontend index.html
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

// module.exports = app;

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const authRoutes = require('../api/routes/authRoutes');
// const curriculumRoutes = require('../api/routes/curriculumRoutes');
// const userRoutes = require('../api/routes/userRoutes');
// const authenticateToken = require('../api/middleware/authenticateToken');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/curriculum', authenticateToken, curriculumRoutes);
// app.use('/api/users', authenticateToken, userRoutes);

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, '../public')));

// // Catch-all route to serve your frontend index.html
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public', 'index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

// module.exports = app;

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const { auth } = require('express-oauth2-jwt-bearer');
// const authRoutes = require('../api/routes/authRoutes');
// const curriculumRoutes = require('../api/routes/curriculumRoutes');
// const userRoutes = require('../api/routes/userRoutes');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Auth0 JWT check middleware
// const jwtCheck = auth({
//   audience: 'https://myapp.com/api',
//   issuerBaseURL: 'https://dev-gkgncylqchbqob52.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/curriculum', jwtCheck, curriculumRoutes);
// app.use('/api/users', jwtCheck, userRoutes);

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Catch-all route to serve your frontend index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Example of a protected route
// app.get('/authorized', jwtCheck, function (req, res) {
//   res.send('Secured Resource');
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// module.exports = app;

// require('dotenv').config({ path: '../.env' });
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const { auth } = require('express-oauth2-jwt-bearer');
// const authRoutes = require('../api/routes/authRoutes');
// const curriculumRoutes = require('../api/routes/curriculumRoutes');
// const userRoutes = require('../api/routes/userRoutes');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Auth0 JWT check middleware
// const jwtCheck = auth({
//   audience: 'https://myapp.com/api',
//   issuerBaseURL: 'https://dev-gkgncylqchbqob52.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/curriculum', jwtCheck, curriculumRoutes);
// app.use('/api/users', jwtCheck, userRoutes);

// // Serve static files from the current directory (public)
// app.use(express.static(__dirname));

// // Catch-all route to serve your frontend index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Example of a protected route
// app.get('/authorized', jwtCheck, function (req, res) {
//   res.send('Secured Resource');
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// module.exports = app;
require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { auth } = require('express-oauth2-jwt-bearer');
const authRoutes = require('../api/routes/authRoutes');
const curriculumRoutes = require('../api/routes/curriculumRoutes');
const userRoutes = require('../api/routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth0 JWT check middleware
const jwtCheck = auth({
    audience: 'https://myapp.com/api',
    issuerBaseURL: 'https://dev-gkgncylqchbqob52.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/curriculum', jwtCheck, curriculumRoutes);
app.use('/api/users', jwtCheck, userRoutes);

// Serve static files from the current directory (public)
app.use(express.static(__dirname));

// Catch-all route to serve your frontend index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Example of a protected route
app.get('/authorized', jwtCheck, function (req, res) {
    res.send('Secured Resource');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
