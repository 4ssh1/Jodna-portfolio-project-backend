const {BookMark, Follows, Likes, Comment} = require('../models/engagementModel')
const handleError = require('../utils/helpers/serverErrorHandler')

const LikePortfolio = async (req, res)=>{
    try {
        const {projectId} = req.params
        const userId = req.user._id

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
            await Likes.create({
            user: userId,
            portfolio: projectId
        })
        res.status(201).json({
            status: "Successful",
            message: "Successfully liked portfolio",
        })
        }
    } catch (error) {
        return handleError(res, error, "User not liked");
    }
}

const BookMarkPortfolio = async (req, res) => {
    const userId = req.user._id
    const {projectId} = req.params

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
        await BookMark.create({
        user: userId,
        portfolio: projectId
    })

        return res.status(200).json({
             status: "Successful",
            message: "Bookmarked successfully"
        })
}
}

const FollowPortfolio = async (req, res) => {
     const userId = req.user._id
    const {projectId} = req.params

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
        await Follows.create({
        user: userId,
        portfolio: projectId
    })
        return res.status(200).json({
             status: "Successful",
            message: "Bookmarked successfully"
        })
}
}

const createComment = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    LikePortfolio, BookMarkPortfolio, FollowPortfolio
}