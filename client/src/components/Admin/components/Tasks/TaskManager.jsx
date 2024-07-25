import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import { Container, Typography, Button, Dialog, DialogContent } from '@mui/material';
import EditTask from './EditTasks';
import CreateTask from './CreateTasks';
import SnackbarAlert from './SnackbarAlert';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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
        setSnackbarOpen(true);
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setSnackbarOpen(true);
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
            setSnackbarOpen(true);

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

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Task Manager
            </Typography>
            <Button
                className="button-custom"
                variant="contained"
                onClick={handleOpenDialog}
                sx={{ color: 'black' }}
            >
                Create Task
            </Button>
            <TaskList
                tasks={tasks}
                onEdit={handleEdit}
                onDelete={(taskId, ownerId) => handleDelete(taskId, ownerId)}
            />
            <Dialog open={dialogOpen} onClose={handleCancel}>
                <DialogContent>
                    {selectedTask ? (
                        <EditTask task={selectedTask} onClose={handleCancel} onSave={handleSave} />
                    ) : (
                        <CreateTask onSave={fetchTasks} onClose={handleCancel} />
                    )}
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

export default TaskManager;
