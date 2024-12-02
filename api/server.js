// Server initializer module
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDB();

// Routes
app.use('/userController', userRoutes);
app.use('/taskController', taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
