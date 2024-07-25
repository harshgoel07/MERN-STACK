import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditTask = ({ task, onClose, onSave }) => {
    const [taskDescription, setTaskDescription] = useState(task.task_description || '');
    const [taskDueDate, setTaskDueDate] = useState(task.task_dueDate ? task.task_dueDate.split('T')[0] : '');
    const [taskStatus, setTaskStatus] = useState(task.task_status || '');
    const [ownerId, setOwnerId] = useState(task.owner_id || '');
    const [projectId, setProjectId] = useState(task.project_id || '');
    const [projects, setProjects] = useState([]);
    const [owners, setOwners] = useState([]);

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
            // Determine the endpoint to use
            let apiUrl;
            let requestData = {
                task_description: taskDescription,
                task_dueDate: taskDueDate,
                task_status: taskStatus,
            };
    
            // If owner_id or project_id has changed, use the update endpoint
            if (ownerId !== task.owner_id || projectId !== task.project_id) {
                try {
                    // Create the task
                    await axios.post('/api/tasks', {
                        task_description: taskDescription,
                        task_dueDate: taskDueDate,
                        task_status: taskStatus,
                        owner_id: ownerId,
                        project_id: projectId,
                    });
    
                    // Task Deletion from the previous owner
                    const { data: projects } = await axios.get(`/api/userDetails/${task.owner_id}/projects`);
    
                    let previousProjectId;
                    for (const project of projects) {
                        if (project.TaskDescription.some(existingTask => existingTask.task_id === task.task_id)) {
                            previousProjectId = project.project_id;
                            break;
                        }
                    }
    
                    if (!previousProjectId) {
                        throw new Error('Project containing the task not found');
                    }
    
                    await axios.delete(`/api/tasks/${task.task_id}`);
                    await axios.delete(`/api/userDetails/${task.owner_id}/project/${previousProjectId}/task/${task.task_id}`);
    
                    toast.success('Task updated successfully');
                    // fetchTasks();
    
                } catch (error) {
                    console.error('Error updating task:', error);
                    // toast.error('Error updating task. Please try again.');
                    // toast.success('Task updated successfully');
                    // fetchTasks();
                }
            } else {
                apiUrl = `/api/userDetails/${task.owner_id}/project/${task.project_id}/task/${task.task_id}`;
            }
    
            // Update the task in the appropriate API
            await axios.put(apiUrl, requestData);
    
            // Also update the task in the tasks API
            await axios.put(`/api/tasks/${task.task_id}`, requestData);
    
            toast.success('Task updated on user details successfully');
            onSave(); // Refresh the task list
            onClose(); // Close the dialog
        } catch (error) {
            console.error('Error updating task:', error);
            // toast.error('Error updating task. Please try again.');  
            onSave(); // Refresh the task list
            onClose(); // Close the dialog  

    };
}
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Task</h2>
            <TextField
                label="Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Due Date"
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
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    required
                >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="not started">Not Started</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Project</InputLabel>
                <Select
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
                <InputLabel>Owner</InputLabel>
                <Select
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
            <Button variant="outlined" color="secondary" onClick={onClose} style={{ marginLeft: '10px' }}>
                Cancel
            </Button>
        </form>
    );
};

export default EditTask;


