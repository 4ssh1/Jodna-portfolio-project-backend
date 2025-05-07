const Project = require('../models/projectModel')

const createProject = async (req, res)=>{
    try {
        const { title, description, githubLink, liveLink, imageUrl, category, technologies, bio, isDraft } = req.body

        const requiredFields = {
            title: "Title is required",
            category: "Category is required",
            githubLink: "Github link is required",
            technologies: "Technologies are required",
            description: "Description is required"
          };
          
          for (const field in requiredFields) {
            if (!req.body[field]) {
              return res.status(400).json({
                status: "Error",
                message: requiredFields[field],
              });
            }
          }
          
        const profile = Project.create({
            title, description, githubLink, liveLink, imageUrl, category, technologies, bio, isDraft  
        })

        if(!profile) return res.status(404).json({
            status: "Error",
            message: "Project not created"
        })

        return res.status(200).json({
            status: "Successful",
            message: "Project created successfully"
        })
        } catch (error) {
            return res.staus(500).json({
                status: "Error",
                message: "Project not created",
                error: error.message
            })
        }
}


const getDrafts = async (req, res)=>{
    try {
        const drafts = await Project.find({isDraft: true})

        if(!drafts || drafts.length === 0){
            return res.status(404).json({
                status: "Error",
                message: "No drafts available",
            })
        }

        res.status(200).json({
            status: "Successful",
            message: "Drafts retrived successfully",
            drafts
        })
        
    } catch (error) {
        res.status(500).json({
            status:"Error",
            message: "Draft not retrived",
            error: error.message
        })
    }
}


const getPublishedProject = async (req, res)=>{
    try {
        const projects = await Project.find({isDraft: false})
        if(!projects || projects.length === 0){
            return res.status(404).json({
                status: "Error",
                message: "No published project"
            })
        }
        
        res.status(200).json({
            staus: "Successful",
            message: "Project retrived successfully",
            projects
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Projects not retrived",
            error: error.message
        })
    }
}

const filterProject = async (req, res)=>{
    try {
        const {category} = req.query
        let filter = {isDraft: false}

        if(category){
            filter.category = category.toLowerCase() // dynamically add filter, If the client sends a query like: '?category=frontend' filter becomes { isDraft: false, category: 'frontend' } 
        }else{
            return res.status(404).json({
                status: "Error",
                message: "No query"
            })
        }

        const projects = await Project.find(filter)

        if(!projects){
            return res.status(404).json({
                status: "No projects found"
            })
        }

        res.status(200).json({
            status: "Successful",
            message: "Projects found successfully",
            projects
        })

    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Projects not retrived by filtering",
            error: error.message
        })
    }
}




module.exports = {createProject, getDrafts, getPublishedProject, filterProject}
