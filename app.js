require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const cors = require('cors')
const {Server} = require('socket.io')
const http = require('http')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger/swagger') // adjust path to your swagger config



const userRoutes = require('./routes/userRoute')
const profileRoutes = require('./routes/profileRoute')
const projectRoutes = require('./routes/projectRoute')

const PORT = process.env.PORT
const app = express()
const server = http.createServer(app) // Create HTTP server from Express app

const io = new Server(server, {
    cors: {
        origin: "",
        // methods: ["GET", "POST"]
      }
    })
    
    const connectedUsers = {}
    
    io.on('connection', (socket)=>{
      console.log("New client connected: ", socket.id)
      
      // Register user with their userId
      socket.on("register", (userId) => {
        connectedUsers[userId] = socket.id;
        console.log(`User ${userId} registered with socket ID ${socket.id}`)
      })
      socket.on('sendNotification', ({receiverId, message})=>{
        io.to(receiverId).emit('getNotification', message)
      })
      
    socket.on('disconnect', ()=>{
      console.log('client disconnected')
    })
    
    // Find and remove the disconnected user from connectedUsers
    for (const [userId, sockId] of Object.entries(connectedUsers)) {
      if (sockId === socket.id) {
        delete connectedUsers[userId];
        console.log(`User ${userId} removed from connected users`);
        break;
      }
    }
  })

  app.set('io', io); // Make IO available in controllers
  app.set('connectedUsers', connectedUsers)
  
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookie())


app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/projects', projectRoutes)
app.use('/api/v1/profiles', profileRoutes)

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    status: 'Error',
    message: 'Route not found'
  });
});


mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/portfolio")
        .then(console.log("DB connected successfully")) 
        .catch(err=>console.log(err))   

server.listen(PORT, ()=>{
    console.log('server is running at http://localhost:' + PORT)
})


