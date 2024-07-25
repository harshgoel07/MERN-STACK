import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { motion } from 'framer-motion';

const ProjectList = ({ projects, setProjects, onEdit, onDelete }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/fetchAllUsers');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        fetchUsers();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const getUserName = (userId) => {
        const user = users.find(user => user.user_id === userId);
        return user ? user.user_name : 'Unknown User';
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Project Name</TableCell>
                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Project Description</TableCell>
                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Owner</TableCell>
                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map(project => (
                        <motion.tr
                            key={project.project_id}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TableCell style={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {project.project_name}
                                </Typography>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <Tooltip title={project.project_description} arrow>
                                    <Typography variant="body2" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                        {project.project_description}
                                    </Typography>
                                </Tooltip>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{getUserName(project.owner_id)}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <IconButton 
                                    color="primary" 
                                    onClick={() => onEdit(project)}
                                    size="small"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton 
                                    color="secondary" 
                                    onClick={() => onDelete(project.project_id)}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProjectList;
