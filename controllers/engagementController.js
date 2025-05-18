const {Bookmark, Follows, Likes, Comment} = require('../models/engagementModel')
const {handleError} = require('../utils/helpers/serverErrorHandler')
const Project = require('../models/projectModel')

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
        }
        
            const userLiked = await Likes.create({
                portfolio: id,
                user: userId
            })
            
            const io = req.app.get('io')
            const connectedUsers = req.app.get('connectedUsers')
            const project = await Project.findById(id).populate('createdBy', '_id name')
            const ownerId = project.createdBy?._id?.toString() || project.createdBy?.toString()
            const socketId = connectedUsers[ownerId]
            
            if(socketId){
                console.log(`Emitting to socket: ${socketId}`)
                io.to(socketId).emit('notification', {
                    type: 'like',
                    message: `${userId} liked your portfolio`,
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
        
    } catch (error) {
        return handleError(res, error, "User not liked");
    }
}

const bookMarkPortfolio = async (req, res) => {
    try { 
        const userId = req.user._id
        const {id} = req.params
    
        if(!id || !userId){
            return res.status(404).json({
                status: "Error",
                message: "Missing Id"
            })
        }

        const prevBookmarked = await Bookmark.findOne({
            user: userId,
            portfolio: id
        })      
        
        if(prevBookmarked){
            await Bookmark.deleteOne({
                _id : prevBookmarked._id
            })
            return res.status(200).json({
                status: "Succesful",
                message: "Bookmark removed"
            })
        }
            const userbookmarked = await Bookmark.create({
                user: userId,
                portfolio: id
            })
            
            const io = req.app.get('io')
            const connectedUsers = req.app.get('connectedUsers')
            const project = await Project.findById(id).populate('createdBy', '_id name')

            if (!project || !project.createdBy) {
                return res.status(404).json({
                    status: "Error",
                    message: "Project or owner not found"
                })
                }

            const ownerId = project.createdBy?._id?.toString() || project.createdBy?.toString() 
            const socketId = connectedUsers[ownerId]
            console.log("ownerId:",ownerId, "socketId:",socketId, "connectedUsers:",connectedUsers)

            if(socketId){
                io.to(socketId).emit('notification', {
                    type: 'bookmark',
                    message: `${userId} bookmarked your portfolio`,
                    id: id,
                });
                } else {
                console.log("No socketId found for ownerId:", ownerId);
                }
 
    
        return res.status(200).json({
            status: "Successful",
            message: "Bookmarked successfully",
            data: {
                userbookmarked
            }
        })
    } catch (error) {
        return handleError(res, error, "User had error bookmarking project");
    }
}

const followPortfolio = async (req, res) => {
  try {
    const followerId = req.user._id
    const { id: portfolioId } = req.params

    if (!portfolioId || !followerId) {
      return res.status(400).json({
        status: "Error",
        message: "Missing follower or portfolio ID"
      })
    }

    const project = await Project.findById(portfolioId).populate('createdBy', '_id name')

    if (!project || !project.createdBy) {
      return res.status(404).json({
        status: "Error",
        message: "Project or owner not found"
      });
    }

    const followingId = project.createdBy._id.toString()

    // Prevent self-follow
    if (followerId.toString() === followingId) {
      return res.status(400).json({
        status: "Error",
        message: "You cannot follow your own portfolio"
      })
    }

    // Check if already following
    const prevFollowed = await Follows.findOne({
      follower: followerId,
      following: followingId
    })

    if (prevFollowed) {
      await Follows.deleteOne({ _id: prevFollowed._id });

      return res.status(200).json({
        status: "Successful",
        message: "Unfollowed successfully"
      });
    }

    const newFollow = await Follows.create({
      follower: followerId,
      following: followingId
    });

    const io = req.app.get('io');
    const connectedUsers = req.app.get('connectedUsers');
    const socketId = connectedUsers[followingId];

    if (socketId) {
      io.to(socketId).emit('notification', {
        type: 'follow',
        message: `${followerId} followed your portfolio`,
        id: portfolioId
      });
    } else {
      console.log(`No socketId found for user ${followingId}`)
    }

    return res.status(200).json({
      status: "Successful",
      message: "Followed successfully",
      data: newFollow
    })

  } catch (error) {
    return handleError(res, error, "User couldn't follow the portfolio")
  }
};

const createComment = async (req, res) => {
    try {
        const {id} = req.params
        const userId = req.user._id
        const {text} = req.body

        if(!userId || !id){
            return res.status(404).json({
                status: "Error",
                message: "Missing Id"
            })
        }

        const comment = await Comment.create({
            user: userId,
            portfolio: id,
            text
        })

        const io = req.app.get('io')
        const connectedUsers = req.app.get('connectedUsers')
        const project = await Project.findById(id).populate('createdBy', '_id name')
        const ownerId = project.createdBy?._id?.toString() || project.createdBy?.toString()
        const socketId = connectedUsers[ownerId]        

        if(socketId){
            io.to(socketId).emit('notification', {
            type: 'comment',
            message: ` ${userId} commented your portfolio`,
            id: id,
            })
        }   

        res.status(200).json({
            status: "Successful",
            message: "Commented successfully",
            data:{
                comment,
            }
        })
    } catch (error) {
        return handleError(res, error, "User could not comment");
    }
}

const getComments = async (req, res) => {
   try {
    const {id} = req.params

    if(!id){
        return res.status(404).json({
            status: "Error",
            message: "Missing Id"
        })
    }

    const comments = await Comment.find({portfolio: id})
                                  .populate("user", "name email")
                                  .sort({createdAt: -1}) // to show recents first, 1 is to show oldest first

    if(!comments){
        return res.status(404).json({
            status: "Error",
            message: "Comments not found"
        })
    }

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
        const {id} = req.params
        const {text} = req.body
    
        const comment = await Comment.findById(id)  

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
        const {id} = req.params
        
        const comment = await Comment.findById(id)

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
            _id: id
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

