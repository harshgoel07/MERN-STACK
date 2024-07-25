import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { List, ListItem, ListItemText, Typography, Divider, Box } from '@mui/material';
import { useAppSelector } from '../../services/hooks';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import axios from 'axios';

const MainBar = ({ selectedProjectId }) => {
  const { tasks } = useAppSelector(state => state.userDetails);
  const [localTasks, setLocalTasks] = useState(tasks);
  const [showAllTasks, setShowAllTasks] = useState(false);

  useEffect(() => {
    if (selectedProjectId) {
      setShowAllTasks(false);
    }
    // Set localTasks based on selected project ID
    const filteredTasks = selectedProjectId ? tasks.filter(task => task.project_id === selectedProjectId) : [];
    setLocalTasks(filteredTasks);
  }, [selectedProjectId, tasks]);

  // Click handler to show all tasks
  const handleHeaderClick = () => {
    setShowAllTasks(true);
  };

  // Function to handle toggle button click
  const handleToggleClick = async (taskId, userId, projectId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'not started' : 'completed';

      // Send PUT request to update task status
      await axios.put(`/api/userDetails/${userId}/project/${projectId}/task/${taskId}`, {
        task_status: newStatus
      });

      await axios.put(`/api/tasks/${taskId}`, {
        task_status: newStatus
      });

      // Update localTasks state to re-render the component with updated task status
      setLocalTasks(prevTasks =>
        prevTasks.map(task =>
          task.task_id === taskId ? { ...task, task_status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <Box p={2}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h5"
          onClick={handleHeaderClick}
          style={{ cursor: 'pointer', marginBottom: '1rem', fontWeight: 'bold' }}
          color="primary"
        >
          Tasks Assigned
        </Typography>
        <List>
          {selectedProjectId ? (
            localTasks.length > 0 ? (
              localTasks.map(task => (
                <motion.div
                  key={task.task_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItem
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      padding: '1rem',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <Box display="flex" alignItems="center" width="100%">
                      <Box flexGrow={1}>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              style={{ fontSize: '1rem', fontWeight: 'bold' }}
                            >
                              {task.task_description}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Box display="flex" alignItems="center">
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}
                                >
                                  {`Status: ${task.task_status}`}
                                </Typography>
                                <ToggleButton
                                  value="check"
                                  selected={task.task_status === 'completed'}
                                  onChange={() => {
                                    handleToggleClick(task.task_id, task.owner_id, task.project_id, task.task_status);
                                  }}
                                  style={{
                                    backgroundColor: task.task_status === 'completed' ? '#4caf50' : '#e0e0e0',
                                    color: task.task_status === 'completed' ? '#fff' : '#000',
                                    transition: 'background-color 0.3s, color 0.3s',
                                    marginRight: '1rem'
                                  }}
                                >
                                  <CheckIcon />
                                </ToggleButton>
                              </Box>
                              <Typography variant="body2" color="textSecondary">
                                {`Due Date: ${new Date(task.task_dueDate).toLocaleDateString()}`}
                              </Typography>
                            </>
                          }
                        />
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider />
                </motion.div>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No tasks available for this project." />
              </ListItem>
            )
          ) : (
            <ListItem>
              <ListItemText primary="Select a project to display tasks." />
            </ListItem>
          )}
        </List>
      </motion.div>
    </Box>
  );
};

export default MainBar;
