const UserDetails = require('../models/UserDetails');

// Get all user details
exports.getAllUserDetails = async (req, res) => {
    try {
        const userDetails = await UserDetails.find({role: "user"});
        res.status(200).json(userDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user details by ID
exports.getUserDetailsById = async (req, res) => {
    try {
        const userDetails = await UserDetails.findOne({ user_id: req.params.user_id });

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }
        res.status(200).json(userDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create new user details
exports.createUserDetails = async (req, res) => {
    const userDetails = new UserDetails(req.body);
    try {
        const savedUserDetails = await userDetails.save();
        res.status(201).json(savedUserDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateUserDetails = async (req, res) => {
    try {
        const { ProjectDescription } = req.body;  // Get the project data from the request body
        const userId = req.params.id;  // Get the user ID from the request parameters

        // Log incoming request data
        console.log('Incoming request body:', req.body);
        console.log('User ID from params:', userId);

        // Find user details by user_id
        const userDetails = await UserDetails.findOne({ user_id: userId });

        if (!userDetails) {
            console.error('User details not found');
            return res.status(404).json({ message: 'User details not found' });
        }

        // Log user details for debugging
        console.log('User Details:', JSON.stringify(userDetails, null, 2));

        // Find the project for the given project_id
        const projectIndex = userDetails.ProjectDescription.findIndex(
            (p) => p.project_id === ProjectDescription[0].project_id
        );

        if (projectIndex !== -1) {
            // Project found; update the project
            userDetails.ProjectDescription[projectIndex] = ProjectDescription[0];
        } else {
            // Project not found; add the new project
            userDetails.ProjectDescription.push(ProjectDescription[0]);
        }

        // Save the updated user details
        const updatedUserDetails = await userDetails.save();
        res.status(200).json(updatedUserDetails);
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(400).json({ message: error.message });
    }
};



// Delete user details by ID
exports.deleteUserDetails = async (req, res) => {
    try {
        const deletedUserDetails = await UserDetails.findByIdAndDelete(req.params.id);
        if (!deletedUserDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }
        res.status(200).json({ message: 'User details deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a project by ID from every user and remove all associated tasks
// In your userDetailsController.js

exports.deleteProjectAndTasks = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        // Find all users who have the project assigned
        const users = await UserDetails.find({ 'ProjectDescription.project_id': projectId });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found with the specified project' });
        }

        // Iterate over each user to remove the project and associated tasks
        for (const user of users) {
            const projectIndex = user.ProjectDescription.findIndex(
                (p) => p.project_id === projectId
            );

            if (projectIndex !== -1) {
                user.ProjectDescription.splice(projectIndex, 1);
                await user.save();
            }
        }

        // Optionally delete tasks associated with the project if you have a separate Task model
        await Task.deleteMany({ project_id: projectId });

        res.status(200).json({ message: 'Project and all associated tasks deleted successfully' });

    } catch (error) {
        console.error('Error deleting project and associated tasks:', error);
        res.status(500).json({ message: error.message });
    }
};


// Delete a task from a project in user details by user ID, project ID, and task ID
exports.deleteTaskById = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const userDetails = await UserDetails.findOne({ user_id: userId });

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        const projectIndex = userDetails.ProjectDescription.findIndex(
            (p) => p.project_id === projectId
        );

        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const taskIndex = userDetails.ProjectDescription[projectIndex].TaskDescription.findIndex(
            (t) => t.task_id === taskId
        );

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        userDetails.ProjectDescription[projectIndex].TaskDescription.splice(taskIndex, 1);

        const updatedUserDetails = await userDetails.save();
        res.status(200).json(updatedUserDetails);
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: error.message });
    }
};

// Fetch all projects for a specific user by user ID
exports.getProjectsByUserId = async (req, res) => {
    try {
        const userId = Number(req.params.userId); // Get the user ID from the request parameters

        // Find user details by user_id
        const userDetails = await UserDetails.findOne({ user_id: userId });

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        // Extract the projects from user details
        const projects = userDetails.ProjectDescription;

        // Respond with the list of projects
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProjectById = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId); // Get the project ID from the request parameters
        const { project_name, project_description } = req.body; // Get the updated project data from the request body

        // Find all user details containing the specified project
        const userDetailsList = await UserDetails.find({ "ProjectDescription.project_id": projectId });

        if (userDetailsList.length === 0) {
            return res.status(404).json({ message: 'Project not found for any user' });
        }

        // Update the project details for each user
        for (const userDetails of userDetailsList) {
            // Find the project index for the given project_id
            const projectIndex = userDetails.ProjectDescription.findIndex(
                (p) => p.project_id === projectId
            );

            if (projectIndex !== -1) {
                // Update the project details
                userDetails.ProjectDescription[projectIndex].project_name = project_name || userDetails.ProjectDescription[projectIndex].project_name;
                userDetails.ProjectDescription[projectIndex].project_description = project_description || userDetails.ProjectDescription[projectIndex].project_description;

                // Save the updated user details
                await userDetails.save();
            }
        }

        res.status(200).json({ message: 'Project details updated for all users' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update a task in a project in user details by user ID, project ID, and task ID
exports.updateTaskById = async (req, res) => {
    try {
        const userId = Number(req.params.userId); // Get the user ID from the request parameters
        const projectId = Number(req.params.projectId); // Get the project ID from the request parameters
        const taskId = Number(req.params.taskId); // Get the task ID from the request parameters
        const { task_description, task_dueDate, task_status } = req.body; // Get the updated task data from the request body

        // Find user details by user_id
        const userDetails = await UserDetails.findOne({ user_id: userId });

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        // Find the project index for the given project_id
        const projectIndex = userDetails.ProjectDescription.findIndex(
            (p) => p.project_id === projectId
        );

        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Find the task index for the given task_id
        const taskIndex = userDetails.ProjectDescription[projectIndex].TaskDescription.findIndex(
            (t) => t.task_id === taskId
        );

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the task details
        userDetails.ProjectDescription[projectIndex].TaskDescription[taskIndex].task_description = task_description || userDetails.ProjectDescription[projectIndex].TaskDescription[taskIndex].task_description;
        userDetails.ProjectDescription[projectIndex].TaskDescription[taskIndex].task_dueDate = task_dueDate || userDetails.ProjectDescription[projectIndex].TaskDescription[taskIndex].task_dueDate;
        userDetails.ProjectDescription[projectIndex].TaskDescription[taskIndex].task_status = task_status || userDetails.ProjectDescription[projectIndex].TaskDescription[taskIndex].task_status;

        // Save the updated user details
        const updatedUserDetails = await userDetails.save();
        res.status(200).json(updatedUserDetails);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a project by user ID and project ID
exports.deleteProjectByUserIdAndProjectId = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const projectId = Number(req.params.projectId);

        const userDetails = await UserDetails.findOne({ user_id: userId });

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        const projectIndex = userDetails.ProjectDescription.findIndex(
            (p) => p.project_id === projectId
        );

        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Project not found' });
        }

        userDetails.ProjectDescription.splice(projectIndex, 1);

        const updatedUserDetails = await userDetails.save();
        res.status(200).json(updatedUserDetails);
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: error.message });
    }
};


// Fetch all projects for a specific user by user ID
exports.getProjectsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDetails = await UserDetails.findOne({ user_id: userId });

    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    const projects = userDetails.ProjectDescription;
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Fetch all tasks for a specific project assigned to a user by user ID and project ID
exports.getTasksByUserIdAndProjectId = async (req, res) => {
    try {
      // Extract userId and projectId from request parameters
      const userId = parseInt(req.params.userId, 10);
      const projectId = parseInt(req.params.projectId, 10);
  
      // Check if userId and projectId are valid numbers
      if (isNaN(userId) || isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid user ID or project ID' });
      }
  
      // Find user details by userId
      const userDetails = await UserDetails.findOne({ user_id: userId }).exec();
  
      // Check if user details were found
      if (!userDetails) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the project within the user's projects
      const project = userDetails.ProjectDescription.find(
        (proj) => proj.project_id === projectId
      );
  
      // Check if the project was found
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Extract tasks from the project
      const tasks = project.TaskDescription;
  
      // Respond with the tasks
      res.status(200).json(tasks);
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

  exports.transferProjectData = async (req, res) => {
    try {
        const oldUserId = Number(req.params.oldUserId); // Get the old user ID from the request parameters
        const newUserId = Number(req.params.newUserId); // Get the new user ID from the request parameters
        const projectId = Number(req.params.projectId); // Get the project ID from the request parameters

        // Find the user details for both old and new users
        const oldUserDetails = await UserDetails.findOne({ user_id: oldUserId });
        const newUserDetails = await UserDetails.findOne({ user_id: newUserId });

        if (!oldUserDetails) {
            return res.status(404).json({ message: 'Old user details not found' });
        }

        if (!newUserDetails) {
            return res.status(404).json({ message: 'New user details not found' });
        }

        // Find the project in the old user's details
        const projectIndex = oldUserDetails.ProjectDescription.findIndex(
            (p) => p.project_id === projectId
        );

        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Project not found in old user details' });
        }

        // Get the project details
        const project = oldUserDetails.ProjectDescription[projectIndex];

        // Check if the new user already has the project
        const newUserProjectIndex = newUserDetails.ProjectDescription.findIndex(
            (p) => p.project_id === projectId
        );

        if (newUserProjectIndex !== -1) {
            // If the project already exists, update its task descriptions
            const newUserProject = newUserDetails.ProjectDescription[newUserProjectIndex];
        } else {
            // Otherwise, add the entire project to the new user's details
            // Update the owner_id of the project
            project.owner_id = newUserId;

            // Update the owner_id in each task description to the new user ID
            project.TaskDescription.forEach(task => {
                task.owner_id = newUserId;
            });

            newUserDetails.ProjectDescription.push(project);
        }

        // Save the new user details
        await newUserDetails.save();

        // Remove the project from the old user's details
        oldUserDetails.ProjectDescription.splice(projectIndex, 1);
        
        // Save the old user details
        await oldUserDetails.save();

        res.status(200).json({ message: 'Project data transferred successfully' });
    } catch (error) {
        console.error('Error transferring project data:', error);
        res.status(500).json({ message: error.message });
    }
};
