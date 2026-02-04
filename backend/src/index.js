require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/error_handler');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth_routes');
const eventRoutes = require('./routes/event_routes');
const categoryRoutes = require('./routes/category_routes');
const criterionRoutes = require('./routes/criterion_route');
const eventCategoryRoutes = require('./routes/event_category_routes');
const candidateRoutes = require('./routes/candidate_routes');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events', eventCategoryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/criterion', criterionRoutes);
app.use('/api/candidates', candidateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
