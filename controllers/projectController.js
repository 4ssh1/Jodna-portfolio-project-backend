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

        if(!profile) return res.status(400).json({
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
                message: "Project not created"
            })
        }
}


const getDrafts = async (req, res)=>{
    try {
        
    } catch (error) {
        
    }
}


const getPublishedProject = async (req, res)=>{
    try {
        
    } catch (error) {
        
    }
}




module.exports = {createProject, getDrafts, getPublishedProject}
