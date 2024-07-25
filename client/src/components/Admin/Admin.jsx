import React, { useState } from "react";
import { AppBar, Box, Button, CssBaseline, Paper, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TaskManager from "./components/Tasks/TaskManager";
import ProjectPage from "./components/Project/ProjectPage";
import { logoutUser } from '../../actions/authAction';
import { styled } from '@mui/material/styles';

// Custom styled tab component
const StyledTab = styled(Tab)(({ theme }) => ({
    fontSize: '0.875rem', // Smaller font size
    textTransform: 'none', // Remove text transformation
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Stylish font
    fontWeight: theme.typography.fontWeightRegular,
    '&.Mui-selected': {
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.palette.primary.main,
    },
}));

const Admin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0); // State to track the selected tab

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                        Admin Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexGrow: 1, p: 2 }}>
                <Paper sx={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        aria-label="admin tabs"
                        variant="fullWidth"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <StyledTab label="Task Manager" />
                        <StyledTab label="Project Page" />
                    </Tabs>
                    <Box sx={{ p: 2 }}>
                        {selectedTab === 0 && <TaskManager />}
                        {selectedTab === 1 && <ProjectPage />}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Admin;
