const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes Placeholder
app.get('/api/health', (req, res) => {
  const firebaseStatus = require('./config/firebase').admin.apps.length > 0 ? 'Initialized' : 'Failed';
  res.json({ 
    message: 'SafeRide+ API is running', 
    vercel: !!process.env.VERCEL,
    firebase: firebaseStatus,
    time: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'SafeRide+ API is running' });
});

// Debug route to see what the server sees
app.use((req, res, next) => {
  console.log(`Request to: ${req.url}`);
  next();
});

// Import routes
const complaintRoutes = require('./routes/complaints');
const performanceRoutes = require('./routes/performance');
const adminRoutes = require('./routes/admin');
const driverRoutes = require('./routes/driver');

// Use routes with both /api prefix and without (for flexibility)
const routes = [
  { path: '/complaints', handlers: complaintRoutes },
  { path: '/performance', handlers: performanceRoutes },
  { path: '/admin', handlers: adminRoutes },
  { path: '/driver', handlers: driverRoutes }
];

routes.forEach(route => {
  app.use(`/api${route.path}`, route.handlers);
  app.use(route.path, route.handlers);
});

// Only listen locally, Vercel handles the server in production
if (!process.env.VERCEL && !process.env.FUNCTION_NAME && !process.env.FUNCTIONS_EMULATOR) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel and other serverless platforms
module.exports = app;
