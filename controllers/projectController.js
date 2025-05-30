const Project = require('../models/projectModel')
const uploadToCloudinary = require('../utils/cloudinary')
const {handleError} = require('../utils/helpers/serverErrorHandler')

const createProject = async (req, res)=>{
    try {
        const { title, description, githubLink, liveLink, category, technologies, bio, isDraft } = req.body
        const id = req.user._id

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

        const techArray = typeof technologies === 'string' ? technologies.split(/[,\s]+/) : technologies;
          
        const profile = await Project.create({
            title, description, githubLink, liveLink, category, technologies, bio, isDraft, createdBy: id
        })
        
        if(!profile) return res.status(404).json({
            status: "Error",
            message: "Project not created"
        })

        return res.status(200).json({
            status: "Successful",
            message: "Project created successfully",
            data:{
                title,
                description,
                githubLink,
                liveLink,
                category,
                technologies: techArray,
                isDraft,
                projectUrl: profile.imageUrl ?? "",
                createdBy: profile.createdBy
            }
        })
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: "Project not created",
                error: error.message
            })
        }
}

const getPublishedProjects = async (req, res)=>{
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
            data:{
                projects
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "Projects not retrived",
            error: error.message
        })
    }
}

const getProject = async (req, res) => {
    try {
        const {id} = req.params
        const project = await Project.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } }, // Increment views by 1
        {isDraft: false},
        { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving project', error: error.message });
  }
}

const filterProject = async (req, res)=>{
    try {
        const {category, technologies,  searchMany, user} = req.query
        let filter = {isDraft: false}
        
        if(category){
            filter.category = category.toLowerCase() // dynamically add filter, If the client sends a query like: '?category=frontend' filter becomes { isDraft: false, category: 'frontend' } 
        }
        
        if(technologies){
            const techArray = technologies.split(/[,\s]+/).map(item => new RegExp(item.trim(), 'i'))
            filter.technologies = { $in: techArray }
        }

        const orFilters = [];

        if (searchMany) {
        orFilters.push(
            { title: { $regex: searchMany, $options: 'i' } },
            { category: { $regex: searchMany, $options: 'i' } },
            { technologies: { $elemMatch: { $regex: searchMany, $options: 'i' } } }
        )
        }

        if (orFilters.length > 0) {
        filter.$or = orFilters
        }

        if (user && mongoose.Types.ObjectId.isValid(user)) {
            filter.createdBy = user
        }

        console.log("Filter used:", filter)

        const projects = await Project.find(filter).populate('createdBy', '-password')
        
        if(projects.length === 0){
            return res.status(404).json({
                status: "No projects found"
            })
        }

        projects.forEach(p => console.log(p.technologies))
        res.status(200).json({
            status: "Successful",
            message: "Projects found successfully",
            data:{
                projects
            }
        })  
//  {
//     "status": "Error",
//     "message": "Projects not retrived by filtering",
//     "error": "Cast to ObjectId failed for value \"Irene\" (type string) at path \"createdBy\" for model \"Project\""
// }
        
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "Projects not retrived by filtering",
            error: error.message
        })
    }
}

const updateProject = async (req, res)=>{
    try {
        const {id} = req.params
        const {technologies} = req.body
        const project = await Project.findOne({
            _id: id,
            createdBy: req.user._id,
            isDraft: false
        })
        
        if(!project){
            return res.status(404).json({
                status: "Error",
                message: "Project not found"
            })
        }
        
        
        if(project.createdBy.toString() !== req.user._id.toString()){
            return res.status(403).json({
                status: "Error",
                message: "User not authorised"
            })
        }
        
        const allowedUpdates = ['title', 'description', 'githubLink', 'liveLink', 'category', 'technologies', 'isDraft']
        const techArray = typeof technologies === 'string' ? technologies.split(/[,\s]+/) : technologies
        allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            if (field === "technologies") {
            project.technologies = techArray
            return
            }else{
            project[field] = req.body[field]
            }
        }
        })


        const updated = await project.save()
        const updatedProject = updated.toObject()

        res.status(200).json({
            status: "Successful",
            message: "Project updated successfully",
            data:{
                updatedProject
            }
        })

    } catch (error) {
        return res.status(500).json({
            status:"Error",
            message: "Error updating project",
            error: error.message
        })
    }
}

const deleteProject = async (req, res)=>{
    try {
      const {id} = req.params
      const project = await Project.findById(id) 
      
      if(!project){
        return res.status(404).json({
            status: "Error",
            message: "Project not found"
        })
      }

      const deleted = await project.deleteOne()

      res.status(200).json({
        status: "Successful",
        message: "Project deleted successfully",
        data: {
            deleted
        }
      })

    } catch (error) {
        return res.status(500).json({
            status:"Error",
            message: "Error deleting project",
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
            data:{
                drafts
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            status:"Error",
            message: "Draft not retrived",
            error: error.message
        })
    }
}

const getDraft = async (req, res) => {
    try {
        const {id} = req.params
        const project = await Project.findById(id)
        if (!project) {
        return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving project', error: error.message });
  }
}

const deleteDraft = async (req, res)=>{
    try {
        const {id} = req.params
        const draft = await Project.findOne({
            _id: id,
            isDraft: true
        })

        if(!draft){
            return res.status(404).json({
                status: "Error",
                message: "Draft not found"
            })
        }

        const deleted = await draft.deleteOne()

        // const deleted = await Project.deleteOne({
        //     _id: id,
        //     isDraft: true
        // }) this does a second call to the database so the above is better

        res.status(200).json({
            status: "Successful",
            message: "Draft deleted successfully",
            data:{
                deleted
            }
        })
    } catch (error) {
       res.status(500).json({
            status:"Error",
            message: "Error deleting drafts",
            error: error.message
        }) 
    }
}

const uploadProjectPicture = async (req, res) =>{
    try {
      // Extract the file buffer from req.file (using multer memoryStorage)
      const { buffer } = req.file;
  
      // Upload the image to Cloudinary using the utility function
      const result = await uploadToCloudinary(buffer, 'project_images');
  
      // Store the URL of the uploaded image in the user's profile
      await Project.findByIdAndUpdate(
        req.params.id,
        { imageUrl: result.secure_url },
        { new: true }
        );
  
      // Send back the updated profile with the image URL
      res.status(200).json({
      status: 'Success',
      message: 'Project image uploaded successfully',
      imageUrl: result.secure_url,
      });
      
    } catch (error) {
      return handleError(res, error,"Error uploading profile picture" )
    }

}


// const projects = await Project.find({
//     category: 'frontend',
//     technologies: { $in: ['React', 'Tailwind'] },
//     isPublished: true,
//     views: { $gte: 100 },
//   });
  


module.exports = {createProject, getDrafts, deleteDraft, getPublishedProjects, getProject,
     filterProject, updateProject, deleteProject, uploadProjectPicture, getDraft}

// analytics
