const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (value) {
                const users = await this.constructor.findOne({
                    name: new RegExp(`^${value}$`, 'i')
                })
                return !users
            },
            message: "Username exists, try using a nickname"
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: async function (value) {
                return /\S+@\S+\.\S+/.test(value)
            },
            message: "Enter a valid email address"
        }
    },
    password: {
        type: String,
        required: true, 
        minlength: 8
    },
    role:{
        type: String,
        enum: ["admin", "norm"],
        default: "norm"
    }, 
    profilePic: {
        type: String, 
    }
}, {timeStamps: true})

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