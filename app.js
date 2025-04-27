require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const cors = require('cors')

const PORT = process.env.PORT
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookie())


app.get('/', (req, res)=>{
    res.send("Hello World")
})

mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/portfolio")
        .then(console.log("DB connected successfully")) 
        .catch(err=>console.log(err))   

app.listen(PORT, ()=>{
    console.log('server is running at http://localhost:' + PORT)
})
