// src/components/TaskManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import { Container, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TableContainer } from '@mui/material';
import EditTask from './EditTasks';
import CreateTask from './CreateTasks';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
            console.log('Fetched tasks:', response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSave = async () => {
        fetchTasks();
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setDialogOpen(true);
    };

    const handleDelete = async (taskId, ownerId) => {
        try {
            const { data: projects } = await axios.get(`/api/userDetails/${ownerId}/projects`);

            let projectId;
            for (const project of projects) {
                if (project.TaskDescription.some(task => task.task_id === taskId)) {
                    projectId = project.project_id;
                    break;
                }
            }

            if (!projectId) {
                throw new Error('Project containing the task not found');
            }

            await axios.delete(`/api/tasks/${taskId}`);
            await axios.delete(`/api/userDetails/${ownerId}/project/${projectId}/task/${taskId}`);

            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleCancel = () => {
        setDialogOpen(false);
        setSelectedTask(null);
    };

    const handleOpenDialog = () => {
        setSelectedTask(null);
        setDialogOpen(true);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Task Manager
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Create Task
            </Button>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <TaskList tasks={tasks} onEdit={handleEdit} onDelete={(taskId, ownerId) => handleDelete(taskId, ownerId)} />
            </TableContainer>
            <Dialog open={dialogOpen} onClose={handleCancel}>
                <DialogContent>
                    {selectedTask ? (
                        <EditTask task={selectedTask} onClose={handleCancel} onSave={handleSave} />
                    ) : (
                        <CreateTask onSave={fetchTasks} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TaskManager;
