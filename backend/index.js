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
app.get('/', (req, res) => {
  res.json({ message: 'SafeRide+ API is running' });
});

// Import routes
const complaintRoutes = require('./routes/complaints');
const performanceRoutes = require('./routes/performance');
const adminRoutes = require('./routes/admin');
const driverRoutes = require('./routes/driver');

// Use routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
