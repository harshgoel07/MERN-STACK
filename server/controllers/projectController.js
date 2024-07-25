const Project = require('../models/Project');

// Create a project
const createProject = async (req, res) => {
    const { project_name, project_description, owner_id } = req.body; // Adjusted to match the schema
    try {
        const newProject = new Project({ project_name, project_description, owner_id }); // Use owner_id and task_ids
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating project' });
    }
};

// Update a project
const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const updateData = req.body;
    try {
        const updatedProject = await Project.findOneAndUpdate({ project_id: projectId }, updateData, { new: true }); // Use project_id instead of MongoDB ObjectId
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating project' });
    }
};

// Delete a project
const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const deletedProject = await Project.findOneAndDelete({ project_id: projectId }); // Use project_id instead of MongoDB ObjectId
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting project' });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find(); // Removed population since owner_id and task_ids are now simple fields
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
};

// Get projects by owner ID
const getProjectsByOwnerId = async (req, res) => {
    const { ownerId } = req.params;
    try {
        const projects = await Project.find({ owner_id: ownerId });
        if (projects.length === 0) {
            return res.status(404).json({ error: 'No projects found for this owner' });
        }
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching projects by owner ID' });
    }
};

// Update owner_id for all projects associated with the old owner
// Update owner_id for a specific project
const updateOwnerIdForProject = async (req, res) => {
    const { projectId, newOwnerId } = req.params;
    try {
        // Find the project by project_id
        const project = await Project.findOne({ project_id: projectId });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Update the owner_id for the project
        const updatedProject = await Project.findOneAndUpdate(
            { project_id: projectId },
            { owner_id: newOwnerId },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Owner ID updated for the project successfully', project: updatedProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating owner ID for the project' });
    }
};

module.exports = { createProject, updateProject, deleteProject, getProjects, getProjectsByOwnerId, updateOwnerIdForProject };


