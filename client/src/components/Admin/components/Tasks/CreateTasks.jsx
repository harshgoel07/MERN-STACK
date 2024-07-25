// src/components/Admin/components/CreateTask.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CreateTask = () => {
  const [projects, setProjects] = useState([]);
  const [owners, setOwners] = useState([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('not started');
  const [ownerId, setOwnerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const dispatch = useDispatch();
  const { loading, error, task } = useSelector((state) => state.task);

  useEffect(() => {
    const fetchProjectsAndOwners = async () => {
      try {
        const projectsResponse = await axios.get('http://localhost:8000/api/projects/');
        const ownersResponse = await axios.get('http://localhost:8000/users');
        setProjects(projectsResponse.data);
        setOwners(ownersResponse.data);
      } catch (error) {
        console.error('Error fetching projects and owners:', error);
      }
    };

    fetchProjectsAndOwners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Create the task
      await axios.post('/api/tasks', {
            task_description: taskDescription,
            task_dueDate: taskDueDate,
            task_status: taskStatus,
            owner_id: ownerId,
            project_id: projectId,
        });
        toast.success(`Task created successfully`);
        window.location.reload()
      
    } catch (error) {
        console.error('Error creating or updating task:', error);
        toast.error('Error creating or updating task. Please try again.');
    }
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Task</h2>
      <TextField
        label="Description"
        name="task_description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Due Date"
        name="task_dueDate"
        type="date"
        value={taskDueDate}
        onChange={(e) => setTaskDueDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          name="task_status"
          label="Status"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="blocked">Blocked</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="not started">Not Started</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Project ID</InputLabel>
        <Select
          name="project_id"
          label="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          {projects.map((project) => (
            <MenuItem key={project.project_id} value={project.project_id}>
              {project.project_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Owner ID</InputLabel>
        <Select
          name="owner_id"
          label="Owner ID"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          required
        >
          {owners.map((owner) => (
            <MenuItem key={owner.user_id} value={owner.user_id}>
              {owner.user_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
      <Button variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>
        Cancel
      </Button>
    </form>
  );
};

export default CreateTask;
