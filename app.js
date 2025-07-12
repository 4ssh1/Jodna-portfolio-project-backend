require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookie = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

// 🆕 Import socket setup function
const setupSocket = require('./services/socket');

const userRoutes = require('./routes/userRoute');
const profileRoutes = require('./routes/profileRoute');
const projectRoutes = require('./routes/projectRoute');
const authRouter = require('./routes/authRoute');

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

const { io, connectedUsers } = setupSocket(server);
app.set('io', io);
app.set('connectedUsers', connectedUsers);


app.use('/swagger-custom.css', express.static(path.join(__dirname, 'swagger-custom.css')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: '/swagger-custom.css'
}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookie());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/auth', authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'Error',
    message: 'Route not found'
  });
});

mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/portfolio")
  .then(() => {
    console.log("DB connected successfully");
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.log(err));
