import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserProjects, fetchUserTasks } from '../../actions/UserProjectActions';
import LeftSideBar from './leftsidebar';
import MainBar from './mainbar';
import { Grid, Paper, AppBar, Toolbar, Box, CssBaseline, Typography, Button } from '@mui/material';
import { useAppSelector } from '../../services/hooks';
import { fetchUserDetails } from '../../store/userDetailsSlice';
import { logoutUser } from '../../actions/authAction';

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const userId = user?.user_id;

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId)); // Fetch user details by user_id
      dispatch(fetchUserProjects(userId)); // Fetch user projects
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (userId && selectedProjectId) {
      dispatch(fetchUserTasks({ userId, projectId: selectedProjectId }));
    }
  }, [userId, selectedProjectId, dispatch]);

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const { userDetails } = useAppSelector((state) => state.userDetails);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {userDetails?.user_name ? `${userDetails.user_name}'s Dashboard` : 'User Dashboard'}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
              <LeftSideBar onSelectProject={handleProjectSelect} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
              <MainBar selectedProjectId={selectedProjectId} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default User;
