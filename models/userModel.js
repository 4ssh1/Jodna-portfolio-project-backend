const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.pre("save", async function(next){
    if(this.isModified("password")) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)    
    } catch (error) {
       console.log(error.message) 
    }

})

module.exports = mongoose.model("User", UserSchema)