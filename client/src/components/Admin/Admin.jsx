import React, { useState } from "react";
import { AppBar, Box, Button, CssBaseline, Paper, Toolbar, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TaskManager from "./components/Tasks/TaskManager";
import ProjectPage from "./components/Project/ProjectPage";
import { logoutUser } from '../../actions/authAction';
import TaskIcon from '@mui/icons-material/TaskOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';

const Admin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0); // State to track the selected tab

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const handleTabChange = (tabIndex) => {
        setSelectedTab(tabIndex);
    };

    const Logo = styled('img')({
        height: 55,
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <AppBar position="static" sx={{ backgroundColor: '#FFB347' }}>
                <Toolbar>
                    <Logo
                        sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }}
                        src="https://www.tigeranalytics.com/wp-content/uploads/2023/09/TA-Logo-resized-for-website_.png"
                        alt="Tiger Analytics Logo" />
                    <Typography variant="h6" sx={{ flexGrow: 1, color: 'black' }}>
                        Admin Dashboard
                    </Typography>
                    <Button color="inherit" onClick={() => handleTabChange(1)} startIcon={<AccountTreeOutlinedIcon />} sx={{ color: 'black' }}>
                        Project Page
                    </Button>
                    <Button color="inherit" onClick={() => handleTabChange(0)} startIcon={<TaskIcon />} sx={{ color: 'black' }}>
                        Task Manager
                    </Button>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ color: 'black' }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexGrow: 1, p: 2 }}>
                <Paper sx={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
