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
        enum: ['all','frontend', 'backend', 'ui-ux' ,'fullstack', 'graphic-design'],
        default: 'all'
    },
    technologies: [String],
    bio:{
        type: String,
        default: ""
    },
    views:{
        type:Number,
        default: 0
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model('Project', ProjectSchema)