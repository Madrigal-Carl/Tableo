require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const errorHandler = require('./middlewares/error_handler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.set('io', io);

app.set('io', io);
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

const authRoutes = require('./routes/auth_routes');
const eventRoutes = require('./routes/event_routes');
const criterionRoutes = require('./routes/criterion_route');
const eventCategoryRoutes = require('./routes/event_category_routes');
const candidateRoutes = require('./routes/candidate_routes');
const competitionScoreRoutes = require('./routes/competition_score_routes');
const judgeRoutes = require('./routes/judge_routes');
const stageRoutes = require('./routes/stage_routes');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events', eventCategoryRoutes);
app.use('/api/criterion', criterionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/competition', competitionScoreRoutes);
app.use('/api/judges', judgeRoutes);
app.use('/api/stages', stageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});