require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth_routes');
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
