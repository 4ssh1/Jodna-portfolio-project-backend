const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (value) {
            const user = await this.constructor.findOne({
                fullname: new RegExp(`^${value}$`, 'i')
            });

            // Skip if it's the same document (e.g., updating)
            if (user && this._id && user._id.toString() !== this._id.toString()) {
                return false;
            }

            return !user;
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
}, {timestamps: true})

UserSchema.pre("save", async function(next){
  try {
    // Hash the password only if it's new or changed
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isNew) {  // Only check for duplicates when creating a new user
      const existingUser = await this.constructor.findOne({ email: this.email });
      if (existingUser) {
        const err = new Error("Email is already in use");
        return next(err);
      }
    }  

    next();
  } catch (error) {
    next(error); // Pass error to Mongoose properly
  }
});


//check for where this function is used and correct
UserSchema.methods.isValidatePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", UserSchema)