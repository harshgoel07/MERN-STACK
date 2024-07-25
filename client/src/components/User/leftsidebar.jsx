import React from 'react';
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LeftSideBar = ({ onSelectProject }) => {
  const { projects } = useSelector(state => state.userDetails);

  return (
    <div>
      <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
      <Typography variant="h5">Projects</Typography>
      <List>
        {projects.map(project => (
          <ListItem button key={project.project_id} onClick={() => onSelectProject(project.project_id)}>
            <ListItemText primary={project.project_name} />
          </ListItem>
        ))}
      </List>
      </motion.div>
    </div>
  );
};

export default LeftSideBar;
