// services/taskService.js

const UserDetails = require('../models/userDetails');
const Task = require('../models/task');

async function createTaskAndUpdateUserDetails(userId, projectId, taskData) {
  try {
    // Create new task
    const newTask = new Task(taskData);
    await newTask.save();

    // Update user details with the new task reference
    await UserDetails.updateOne(
      { user_id: userId, 'ProjectDescription.project_id': projectId },
      {
        $push: {
          'ProjectDescription.$.TaskDescription': {
            task_id: newTask.task_id,
            task_description: newTask.task_description,
            task_dueDate: newTask.task_dueDate,
            task_status: newTask.task_status,
            owner_id: newTask.owner_id,
            project_id: newTask.project_id
          }
        }
      }
    );

    console.log('Task created and user details updated');
    return newTask;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}

module.exports = {
  createTaskAndUpdateUserDetails
};
