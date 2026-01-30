require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth_routes');
const eventRoutes = require('./routes/event_routes');
const categoryRoutes = require('./routes/category_route');
const criterionRoutes = require('./routes/criterion_route');

app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/criterion', criterionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
