const mongoose = require('mongoose')

const ProjectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        default: ""
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    githubLink:{
        type: String,
        required: true,
    }, 
    liveLink: {
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
    }, 
    category: {
        type: String,
        enum: ['frontend', 'backend', 'fullstack', 'other'],
        default: 'other'
    },
    technologies: [String]
})

module.exports = mongoose.model('Project', ProjectSchema)