import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Dialog, DialogContent } from '@mui/material';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import SnackbarAlert from './SnackbarAlert';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects', error);
        }
    };

    const handleCreateProject = async (project) => {
        try {
            const response = await axios.post('/api/projects', project);
            setProjects([...projects, response.data]);
            setSnackbarOpen(true);
            setDialogOpen(false);
            fetchProjects(); // Fetch updated projects
        } catch (error) {
            console.error('Error creating project', error);
        }
    };

    const handleUpdateProject = async (project) => {
        if (!selectedProject) return;
        try {
            const response = await axios.put(`/api/projects/${selectedProject.project_id}`, project);
            setProjects(projects.map(proj => proj.project_id === selectedProject.project_id ? response.data : proj));
            setSelectedProject(null);
            setSnackbarOpen(true);
            setDialogOpen(false);
            fetchProjects();
        } catch (error) {
            console.error('Error updating project', error);
            setSnackbarOpen(true);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await axios.delete(`/api/projects/${projectId}`);
            setProjects(projects.filter(project => project.project_id !== projectId));
            await axios.delete(`/api/tasks/project/${projectId}`);
            await axios.delete(`/api/userDetails/project/${projectId}`);
            setSnackbarOpen(true);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project', error);
            window.location.reload();
        }
    };

    const handleSelectProject = (project) => {
        setSelectedProject(project);
        setDialogOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleOpenDialog = () => {
        setSelectedProject(null);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Project Manager
            </Typography>
            <Button
                className="button-custom"
                variant="contained"
                onClick={handleOpenDialog}
                sx={{ color: 'black' }}>
                Create Project
            </Button>
            <ProjectList
                projects={projects}
                onEdit={handleSelectProject}
                onDelete={handleDeleteProject}
            />
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogContent>
                    <ProjectForm
                        selectedProject={selectedProject}
                        onCreate={handleCreateProject}
                        onUpdate={handleUpdateProject}
                        onCancel={handleCloseDialog}
                        fetchProjects={fetchProjects}
                    />
                </DialogContent>
            </Dialog>
            <SnackbarAlert
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                message="Action completed successfully!"
            />
        </Container>
    );
};

export default ProjectPage;
