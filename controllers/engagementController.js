const {BookMark, Follows, Likes, Comment} = require('../models/engagementModel')
const {handleError} = require('../utils/helpers/serverErrorHandler')
const connectedUsers = require('../app')
const Project = require('../models/projectModel')
const User = require('../models/userModel')

const likePortfolio = async (req, res)=>{
    try {
        const {id} = req.params
        const userId = req.user._id

        if(!id || !userId){
            return res.status(404).json({
                status: "Error",
                message: "Missing Id"
            })
        }

        const prevLiked = await Likes.findOne({
            portfolio: id,
            user: userId
        })

        
        if(prevLiked){
            await Likes.deleteOne({
                _id: prevLiked._id
            })
            return res.status(200).json({
                message: "Like removed"
            })
        }else{
            const userLiked = await Likes.create({
                portfolio: id,
                user: userId
            })
            
            const io = req.app.get('io')
            const project = await Project.findById(id).populate('createdBy', '_id name')
            const ownerId = project.createdBy?.toString()
            const socketId = connectedUsers[ownerId]

        if(socketId){
            console.log(`Emitting to socket: ${socketId}`)
            io.to(socketId).emit('notification', {
                type: 'like',
                message: `A ${project.createdBy.name} liked your portfolio`,
                projectId: id,
                userId: userId
            })
        }

        res.status(201).json({
            status: "Successful",
            message: "Successfully liked portfolio",
            data: {
                userLiked,
                liker: project.createdBy.name,
                project
            }
        })
        }
    } catch (error) {
        return handleError(res, error, "User not liked");
    }
}

const bookMarkPortfolio = async (req, res) => {
    try { 
        const userId = req.user._id
        const {projectId} = req.params
    
        if(!projectId || !userId){
            return res.status(404).json({
                status: "Error",
                message: "Missing Id"
            })
        }

        const prevBookmarked = await BookMark.findOne({
            user: userId,
            portfolio: projectId
        })      
        
        if(prevBookmarked){
            await BookMark.deleteOne({
                _id : prevBookmarked._id
            })
            return res.status(200).json({
                status: "Succesful",
                message: "Bookmark removed"
            })
        }else{
            const userbookmarked = await BookMark.create({
                user: userId,
                portfolio: projectId
            })
            
            const io = req.app.get('io')
            const project = await Project.findById(projectId).populate('user', '_id')
            const ownerId = project.user._id.toString()
            const liker = await User.findById(userId).select('name')
            const socketId = connectedUsers[ownerId]

            if(socketId){
                io.to(socketId).emit('notification', {
                    type: 'bookmark',
                    message: `A ${liker.name} bookmarked your portfolio`,
                    projectId: projectId,
                })
            }      
    
        return res.status(200).json({
            status: "Successful",
            message: "Bookmarked successfully",
            data: {
                userbookmarked
            }
        })
    }
    } catch (error) {
        return handleError(res, error, "User had error bookmarking project");
    }
}

const followPortfolio = async (req, res) => {
    try { 
        const userId = req.user._id
        const {projectId} = req.params
    
        if(!projectId || !userId){
            return res.status(404).json({
                status: "Error",
                message: "Missing Id"
            })
        }

        const prevFollowed = await Follows.findOne({
            user: userId,
            portfolio: projectId
        })
        
        if(prevFollowed){
            await Follows.deleteOne({
                _id : prevFollowed._id
            })
            return res.status(200).json({
                status: "Succesful",
                message: "Bookmark removed"
            })
        }else{
            const userFollow = await Follows.create({
                user: userId,
                portfolio: projectId
            })
            
            const io = req.app.get('io')
            const project = await Project.findById(projectId).populate('user', '_id')
            const ownerId = project.user._id.toString()
            const liker = await User.findById(userId).select('name')
            const socketId = connectedUsers[ownerId]        

        if(socketId){
            io.to(socketId).emit('notification', {
            type: 'follow',
            message: `A ${liker.name} followed your portfolio`,
            projectId: projectId,
            })
        }     
        return res.status(200).json({
            status: "Successful",
            message: "followed successfully",
            data: {
                userFollow
            }
        })
    }
    } catch (error) {
        return handleError(res, error, "User couldn't follow");        
    }
}

const createComment = async (req, res) => {
    try {
        const {projectId} = req.params
        const userId = req.user._id
        const {text} = req.body

        if(!userId || !projectId){
            return res.status(404).json({
                status: "Error",
                message: "Missing Id"
            })
        }

        const comment = await Comment.create({
            user: userId,
            portfolio: projectId,
            text
        })

        const io = req.app.get('io')
        const project = await Project.findById(projectId).populate('user', '_id')
        const ownerId = project.user._id.toString()
        const liker = await User.findById(userId).select('name')
        const socketId = connectedUsers[ownerId]        

        if(socketId){
            io.to(socketId).emit('notification', {
            type: 'comment',
            message: `A ${liker.name} commented your portfolio`,
            projectId: projectId,
            })
        }   

        res.status(200).json({
            status: "Successful",
            message: "Commented successfully",
            data:{
                comment
            }
        })
    } catch (error) {
        return handleError(res, error, "User could not comment");
    }
}

const getComments = async (req, res) => {
   try {
    const {projectId} = req.params

    if(!projectId){
        return res.status(404).json({
            status: "Error",
            message: "Missing Id"
        })
    }

    const comments = await Comment.find({portfolio: projectId})
                                  .populate("user", "name email")
                                  .sort({createdAt: -1}) // to show recents first, 1 is to show oldest first

    res.status(200).json({
        status: "Successful",
        message: "User commented successfully",
        data:{
            comments
        }
    })
   } catch (error) {
        return handleError(res, error, "Error getting comments");           
   } 
}

const updateComment = async (req, res)=>{
    try {
        const {commentId} = req.params
        const {text} = req.body
    
        const comment = await Comment.findById(commentId)  

        if(!comment){
            return res.status(404).json({
                status: "Error",
                message: "Comment not found"
            })
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                 status: "Error", 
                 message: "Not authorized" 
            });
        }

        comment.text = text
        comment.edited = true

        await comment.save()

        res.status(200).json({
            status: "Successful",
            message: "Comment edited successfully",
            data:{
                comment
            }
        })

    } catch (error) {
        return handleError(res, error, "Error editing comment");                
    }
}

const deleteComment = async (req, res) => {
    try {
        const {commentId} = req.params
        
        const comment = await Comment.findById(commentId)

        if(!comment){
            return res.status(404).json({
                status: "Error",
                message: "Comment not found"
            })
        }

        if(comment.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                status: "Error",
                message: "User not authorized"
            })
        }

        await Comment.deleteOne({
            _id: commentId
        })

        res.status(200).json({
            status: "Successful",
            message: "Comment deleted successfully"
        })
    } catch (error) {
        return handleError(res, error, "Error deleting comment");                
    }
}

module.exports = {
    likePortfolio, bookMarkPortfolio, followPortfolio, createComment, getComments, updateComment, deleteComment
}

