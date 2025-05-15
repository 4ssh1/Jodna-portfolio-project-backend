const User = require('../models/userModel')
const Project = require('../models/projectModel')
const Subscriber = require('../models/subscriberModel') 
const uploadToCloudinary = require('../utils/cloudinary') 
const {handleError} = require('../utils/helpers/serverErrorHandler')

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
        const {id} = req.params
        const user = await User.findById(id).select('-password')

        await User.findByIdAndUpdate(
        user,
        { $inc: { views: 1 } },
        { new: true }
        )


        if(!user) return res.status(404).json({
            status: "Error",
            message: "User not found"
        })

        res.status(200).json({
            status: "Successful",
            message: "User found",
            data:{
                user
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
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: "User not found"
      });
    }

    // Get current fullname and split it
    const [currentFirstname = '', ...rest] = user.fullname.split(' ');
    const currentLastname = rest.join(' '); // Handles middle names or compound last names

    // Use new values if provided, otherwise fallback to current values
    const firstnameToUse = req.body.firstname ?? currentFirstname;
    const lastnameToUse = req.body.lastname ?? currentLastname;

    // Check if at least one of them is updated
    if (
      req.body.firstname === undefined &&
      req.body.lastname === undefined
    ) {
      return res.status(400).json({
        status: "Error",
        message: "No valid fields provided for update"
      });
    }

    user.fullname = `${firstnameToUse} ${lastnameToUse}`.trim()

    await user.save()

    const userObj = user.toObject({ getters: true })
    delete userObj.password

    res.status(200).json({
      status: "Successful",
      message: "User updated successfully",
      data: { user: userObj }
    })

  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "User not updated",
      error: error.message || error
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

const uploadProfilePicture = async (req, res) => {
  try {
    // Extract the file buffer from req.file (using multer memoryStorage)
    const { buffer } = req.file;

    // Upload the image to Cloudinary using the utility function
    const result = await uploadToCloudinary(buffer, 'profile_pictures');
    console.log(result.secure_url)
    // Store the URL of the uploaded image in the user's profile
    const updatedProfile = await User.findOneAndUpdate(
       req.user._id ,  // Assuming you're using a user identifier from your auth middleware
      { profilePic: result.secure_url },
      { new: true }
    );

    // Send back the updated profile with the image URL
    res.status(200).json({
      message: "Profile picture updated successfully",
      profile: updatedProfile,
      imageUrl: result.secure_url,
    });
     
  } catch (error) {
    return handleError(res, error,"Error uploading profile picture" )
  }
};





module.exports = {getUser, updateUser, deleteUser, viewsOfUsers, getAllUser, uploadProfilePicture}

