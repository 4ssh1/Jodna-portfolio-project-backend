const User = require('../models/userModel')
const Project = require('../models/projectModel')
const Subscriber = require('../models/subscriberModel') 

const getAllUser = async(req, res)=>{
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
            data:{
                count: users.length
            }
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Server error",
            err: error.message
        })
    }
}

const getUser = async(req, res)=>{
    try {
        const email = req.body
        const users = await User.findOne({email}).select('-password')

        if(!users) return res.status(404).json({
            status: "Error",
            message: "User not found"
        })

        res.status(200).json({
            status: "Successful",
            message: "Users found",
            data:{
                count: users.length
            }
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

        // const user = await User.findById(id).select('-password');
        // the password field is never included in the response

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

        await user.save() // runs all validators and pre-save hooks, will trigger pre-save hashing

        
        const userObj = user.toObject({ getters: true });
        // Convert the Mongoose user document to a plain JavaScript object, 
        // including virtuals and getters, without affecting the database. 
        // This ensures the response is clean and frontend-friendly.
        // does not modify database

        delete userObj.password; // delete is a javascript concept used primarily for objects, not good for arrays


        res.status(200).json({
            status: "Successful",
            message: "User updated successfully",
            data:{
                user: userObj
            }
        })

    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "User not updated"
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).select('-password')
    
        if(!user){
            return res.status(404).json({
                    status: "Error",
                    message: "User not found"
                }
            )
        }
    
        await user.deleteOne()  // his version is used after you’ve fetched the document.
                                // No filter is needed because you already have the exact document .
                                // This is often used when you want to check the document before deleting.
    
        res.status(200).json({
            status: "Error",
            message: "User deleted successfully"
        })       
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "User not deleted"
        })
    }
    
}

const viewsOfUsers = async (req, res) => {
    const {id} = req.params
    const user = User.findById(id)
    const project = Project.find({createdBy: id})

    if(!user){
        return res.status(404).json({
            status: "Error",
            message: "User not found"
        })
    }
    const totalViews = project.reduce((total, proj)=>{
        return total += proj.views || 0
    }, 0)


    const viewsPerProject = project.map(p => ({
        title: p.title,
        id: p._id,
        views: p.views
      }));
  
      res.status(200).json({
        status: "Success",
        data:{
            totalViews,
            projectCount: project.length,
            viewsPerProject
        }
      });

   
}

const submitNewsLetters = async (req, res) => {
    
}

module.exports = {getUser, updateUser, deleteUser, viewsOfUsers, getAllUser}

// the admin is the only one that should have access to this routes