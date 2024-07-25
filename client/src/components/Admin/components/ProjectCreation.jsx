import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProjectCreation = () => {
    const [projectData, setProjectData] = useState({
        project_name: '',
        project_description: '',
        owner_id: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create the project
            const projectResponse = await axios.post('/api/projects', {
                ...projectData,
            });
            
            const createdProject = projectResponse.data;
            toast.success('Project created successfully!');

            // Update the user details
            const userDetailsResponse = await axios.put(`/api/userDetails/${projectData.owner_id}`, {
                ProjectDescription: [{
                    project_id: createdProject.project_id,
                    project_name: createdProject.project_name,
                    project_description: createdProject.project_description,
                    owner_id: createdProject.owner_id,
                    TaskDescription: []
                }]
            });

            if (userDetailsResponse.status === 200) {
                toast.success('User details updated successfully!');
            } else {
                toast.error('Failed to update user details.');
            }

            setProjectData({ project_name: '', project_description: '', owner_id: '' }); // Reset form
        } catch (error) {
            console.error(error);
            toast.error('Error creating project. Please try again.');
        }
    };

    return (
        <div className="project-creation">
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Project Name:</label>
                    <input
                        type="text"
                        name="project_name"
                        value={projectData.project_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Project Description:</label>
                    <textarea
                        name="project_description"
                        value={projectData.project_description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Owner ID:</label>
                    <input
                        type="number"
                        name="owner_id"
                        value={projectData.owner_id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
};

export default ProjectCreation;
