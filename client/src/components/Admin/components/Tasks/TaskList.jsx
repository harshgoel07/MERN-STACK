import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';

const TaskList = ({ tasks, onEdit, onDelete }) => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/fetchAllUsers');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            }
        };

        fetchUsers();
        fetchProjects();
    }, []);

    const getUserName = (userId) => {
        const user = users.find(user => user.user_id === userId);
        return user ? user.user_name : 'Unknown User';
    };

    const getProjectName = (projectId) => {
        const project = projects.find(project => project.project_id === projectId);
        return project ? project.project_name : 'Unknown Project';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '20%', textAlign: 'center', fontWeight: 'bold' }}>Description</TableCell>
                        <TableCell style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>Due Date</TableCell>
                        <TableCell style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>Owner</TableCell>
                        <TableCell style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>Project</TableCell>
                        <TableCell style={{ width: '20%', textAlign: 'center', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <motion.tr
                            key={task.task_id}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TableCell style={{ textAlign: 'center' }}>
                                <Tooltip title={task.task_description} arrow>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {task.task_description}
                                    </Typography>
                                </Tooltip>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{formatDate(task.task_dueDate)}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{task.task_status}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{getUserName(task.owner_id)}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{getProjectName(task.project_id)}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <IconButton
                                    color="primary"
                                    onClick={() => onEdit(task)}
                                    size="small"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={() => onDelete(task.task_id, task.owner_id)}
                                    size="small"
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TaskList;
