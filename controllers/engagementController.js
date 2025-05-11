const {BookMark, Follows, Likes, Comment} = require('../models/engagementModel')
const handleError = require('../utils/helpers/serverErrorHandler')

const LikePortfolio = async (req, res)=>{
    try {
        const {projectId} = req.params
        const userId = req.user._id

        if(!projectId || !userId){
            return res.status(404).json({
                status: "Error",
                message: "Missing Id"
            })
        }

        const prevLiked = await Likes.findOne({
            user: userId,
            portfolio: projectId
        })
        if(prevLiked){
            await Likes.deleteOne({
                _id: prevLiked._id
            })
            return res.status(200).json({
                status: "Successful",
                message: "Like removed"
            })
        }else{
            const userLiked = await Likes.create({
            user: userId,
            portfolio: projectId
        })
        res.status(201).json({
            status: "Successful",
            message: "Successfully liked portfolio",
            data: {
                userLiked
            }
        })
        }
    } catch (error) {
        return handleError(res, error, "User not liked");
    }
}

const BookMarkPortfolio = async (req, res) => {
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

const FollowPortfolio = async (req, res) => {
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
            return res.status(200).json({
                 status: "Successful",
                 message: "Bookmarked successfully",
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
    LikePortfolio, BookMarkPortfolio, FollowPortfolio, createComment, getComments, updateComment, deleteComment
}

// crud operations for comments