const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');
const UserDetails = require('../models/UserDetails');
const mongoose = require('mongoose');
const moment = require('moment');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { task_description, task_dueDate, task_status, owner_id, project_id } = req.body;

    // Convert IDs to numbers
    const ownerId = Number(owner_id);
    const projectId = Number(project_id);

    // Validate if owner_id and project_id are valid numbers
    if (isNaN(ownerId) || isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid owner ID or project ID' });
    }

    // Validate if owner_id and project_id exist in their respective collections
    const userExists = await User.findOne({ user_id: ownerId });
    if (!userExists) {
      return res.status(400).json({ error: 'Owner not found' });
    }

    const projectExists = await Project.findOne({ project_id: projectId });
    if (!projectExists) {
      return res.status(400).json({ error: 'Project not found' });
    }

    const task = new Task({
      task_description,
      task_dueDate,
      task_status,
      owner_id: ownerId,
      project_id: projectId
    });

    await task.save();

    // Check if the project exists for the user in UserDetails collection
    const userDetails = await UserDetails.findOne({ user_id: ownerId, "ProjectDescription.project_id": projectId });

    if (userDetails) {
      // Project exists for the user, update the existing project
      await UserDetails.updateOne(
        { user_id: ownerId, "ProjectDescription.project_id": projectId },
        {
          $push: {
            "ProjectDescription.$.TaskDescription": {
              task_id: task.task_id,  // Use task._id here
              task_description,
              task_dueDate,
              task_status,
              owner_id: ownerId,
              project_id: projectId
            }
          }
        }
      );
    } else {
      // Project does not exist for the user, create a new project for the user
      const projectDetails = await Project.findOne({ project_id: projectId });

      await UserDetails.updateOne(
        { user_id: ownerId },
        {
          $push: {
            ProjectDescription: {
              project_id: projectId,
              project_name: projectDetails.project_name,
              project_description: projectDetails.project_description,
              owner_id: ownerId,
              TaskDescription: [
                {
                  task_id: task.task_id,  // Use task._id here
                  task_description,
                  task_dueDate,
                  task_status,
                  owner_id: ownerId,
                  project_id: projectId
                }
              ]
            }
          }
        },
        { upsert: true }
      );
    }

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findOne({ task_id: taskId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { task_description, task_dueDate, task_status, owner_id } = req.body;

    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    let updatedFields = {
      task_description,
      task_status
    };

    // Validate and update task_dueDate if provided and valid
    if (task_dueDate) {
      if (!moment(task_dueDate, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ error: 'Invalid date format for task_dueDate. Use YYYY-MM-DD format.' });
      }
      updatedFields.task_dueDate = moment(task_dueDate).toDate();
    }

    // Update owner_id if provided
    if (owner_id) {
      updatedFields.owner_id = owner_id;
    }

    const task = await Task.findOneAndUpdate(
      { task_id: taskId },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findOneAndDelete({ task_id: taskId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get tasks by owner ID
const getTasksByOwnerId = async (req, res) => {
  const ownerId = Number(req.params.ownerId);
  try {
    if (isNaN(ownerId)) {
      return res.status(400).json({ error: 'Invalid owner ID' });
    }

    const tasks = await Task.find({ owner_id: ownerId });
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found for this owner' });
    }
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete tasks by project ID
const deleteTasksByProjectId = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const result = await Task.deleteMany({ project_id: projectId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No tasks found for this project' });
    }
    res.json({ message: 'Tasks deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByOwnerId,
  deleteTasksByProjectId
};
