const User = require('../models/userModel')

const getUser = async(req, res)=>{
    try {
        const users = await User.find().select('-password')
        // find() returns an array whether empty or notxxxxx
        // findOne() returns an object

        if(!users) return res.status(404).json({
            status: "Error",
            message: "User not found"
        })

        res.status(200).json({
            status: "Successful",
            message: "Users found",
            count: users.length
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Server error",
            err: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
    const {id} = req.params
        const user = await User.findById(id)

        if(!user){
            return res.status(404).json({
                status: "Error",
                message: "User not updated"
            })
        }

        const allowedUpdates = ['firstName', 'lastName', 'email', 'role', 'password'];
        allowedUpdates.forEach(field =>{
            if(req.body[field] !== undefined){
                user[field] = req.body[field]
            }
        })

    } catch (error) {
        
    }
}

const deleteUser = async (req, res) => {
    
}

const viewsOfUser = async (req, res) => {
    
}

module.exports = {getUser, updateUser, deleteUser, viewsOfUser}

// the admin is the only one that should have access to this routes