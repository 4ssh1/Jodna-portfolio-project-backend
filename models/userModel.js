const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic:{
        type: Buffer
    },
    bio:{
        type: String,
        default: ""
    },
    views:{
        type:Number,
        default: 0
    }
})

UserSchema.pre("save", async function(next){
    if(this.isModified("password")) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)   
        
        const existingUser = await this.constructor.findOne({email: this.email})
        if(existingUser) throw new Error("Email is already in use")
    } catch (error) {
       console.log(error.message) 
    }
    next()
})

UserSchema.methods.isVallidatePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", UserSchema)