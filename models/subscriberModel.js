const mongoose = require('mongoose')

const SubscribersSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true, 
        validate: {
            validator: async function(value){
                return /\S+@\S+\.\S+/.test(value)
            },
            message: "Enter a valid email"
        }
    }
}, {timestamps: true})

module.exports = mongoose.model("Subscribers", SubscribersSchema)