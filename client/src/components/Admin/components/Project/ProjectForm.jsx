import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProjectForm = ({ selectedProject, onCreate, onUpdate, onCancel, fetchProjects }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [owners, setOwners] = useState([]);

    useEffect(() => {
        if (selectedProject) {
            setProjectName(selectedProject.project_name);
            setProjectDescription(selectedProject.project_description);
            setOwnerId(selectedProject.owner_id);
        } else {
            setProjectName('');
            setProjectDescription('');
            setOwnerId('');
        }
    }, [selectedProject]);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users');
                setOwners(response.data);
            } catch (error) {
                console.error('Error fetching owners:', error);
            }
        };

        fetchOwners();
    }, []);

    const handleSubmit = async () => {
        if (!projectName || !projectDescription || !ownerId) {
            alert('All fields are required');
            return;
        }

        try {
            const previousOwnerId = selectedProject ? selectedProject.owner_id : null;
            let projectResponse;

            if (selectedProject) {
                if (previousOwnerId === ownerId) {
                    // Update existing project under the same owner
                    projectResponse = await axios.put(`/api/projects/${selectedProject.project_id}`, {
                        project_name: projectName,
                        project_description: projectDescription,
                        owner_id: ownerId
                    });
                    toast.success('Project updated successfully!');

                    // Update the project in the userDetails API
                    await axios.put(`/api/userDetails/project/${selectedProject.project_id}`, {
                        project_name: projectName,
                        project_description: projectDescription
                    });
                    toast.success('Project details updated in user details successfully!');
                } else {
                    // Transfer project data from old owner to new owner
                    await axios.put(`/api/userDetails/transfer/${previousOwnerId}/${ownerId}/${selectedProject.project_id}`);
                    toast.success('Project data transferred from the old owner to the new owner successfully!');
                    
                    // Update owner_id for the selected project
                    await axios.put(`/api/projects/updateOwner/${selectedProject.project_id}/${ownerId}`);
                    toast.success('Owner ID updated for the project successfully!');
                    
                    // Update owner_id for tasks in the new owner's project
                    const tasksResponse = await axios.get(`/api/tasks?project_id=${selectedProject.project_id}`);
                    const tasks = tasksResponse.data;
                    
                    await Promise.all(tasks.map(task =>
                        axios.put(`/api/tasks/${task.task_id}`, {
                            task_description: task.task_description,
                            task_dueDate: task.task_dueDate,
                            task_status: task.task_status,
                            owner_id: ownerId  // Update owner_id for each task
                        })
                    ));
                    toast.success('Tasks updated with the new owner successfully!');
                }
            } else {
                // No selectedProject, meaning we are creating a new project
                projectResponse = await axios.post('/api/projects', {
                    project_name: projectName,
                    project_description: projectDescription,
                    owner_id: ownerId
                });
                toast.success('Project created successfully!');

                const createdProject = projectResponse.data;

                // Update the userDetails API with the new project
                await axios.put(`/api/userDetails/${ownerId}`, {
                    ProjectDescription: [{
                        project_id: createdProject.project_id,
                        project_name: createdProject.project_name,
                        project_description: createdProject.project_description,
                        owner_id: createdProject.owner_id,
                        TaskDescription: []
                    }]
                });
                toast.success('User details updated with the new project successfully!');
            }

            // Fetch updated projects
            fetchProjects();

            // Clear form fields
            setProjectName('');
            setProjectDescription('');
            setOwnerId('');

            // Close the form
            onCancel();
        } catch (error) {
            console.error('Error creating or updating project:', error.response ? error.response.data : error.message);
            toast.error('Error creating or updating project. Please try again.');
        }
    };

    return (
        <div>
            <h2>{selectedProject ? 'Update Project' : 'Create Project'}</h2>
            <TextField
                label="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Project Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                fullWidth
                margin="normal"
            />
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
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}
            >
                {selectedProject ? 'Update Project' : 'Create Project'}
            </Button>
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={onCancel}
                style={{ marginLeft: '10px' }}
            >
                Cancel
            </Button>
        </div>
    );
};

export default ProjectForm;
