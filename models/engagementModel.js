const mongoose = require('mongoose')

const BookmarkSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }
})

const FollowSchema = mongoose.Schema({
    following:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    follower:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const LikeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true       
    },
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }
})

const CommentSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    edited: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Bookmark = mongoose.model('Bookmark', BookmarkSchema)
const Follows = mongoose.model('Follow', FollowSchema)
const Likes = mongoose.model('Like', LikeSchema)
const Comment = mongoose.model('Comment', CommentSchema)



module.exports = {
    Bookmark, Follows, Likes, Comment
}

