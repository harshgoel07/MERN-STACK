import React, { useState } from 'react';
import { AppBar, Box, Button, CssBaseline, Paper, Toolbar, Typography, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TaskManager from "./components/Tasks/TaskManager";
import ProjectPage from "./components/Project/ProjectPage";
import { logoutUser } from '../../actions/authAction';
import TaskIcon from '@mui/icons-material/TaskOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const Admin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0); // State to track the selected tab
    const [anchorEl, setAnchorEl] = useState(null); // State to manage Profile Menu

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const handleTabChange = (tabIndex) => {
        setSelectedTab(tabIndex);
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    const Logo = styled('img')({
        height: 55,
    });

    const user = {
        user_name: "Himanshu",
        email: "him@gmail.com",
        role: "admin"
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <AppBar position="static" sx={{ backgroundColor: '#FFB347' }}>
                <Toolbar>
                    <Logo
                        sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }}
                        src="https://www.tigeranalytics.com/wp-content/uploads/2023/09/TA-Logo-resized-for-website_.png"
                        alt="Tiger Analytics Logo"
                    />
                    <Typography variant="h6" sx={{ flexGrow: 1, color: 'black' }}>
                        {/* Admin Workspace */}
                        Task Tracker
                    </Typography>
                    <Button color="inherit" onClick={() => handleTabChange(1)} startIcon={<AccountTreeOutlinedIcon />} sx={{ color: 'black' }}>
                        Projects
                    </Button>
                    <Button color="inherit" onClick={() => handleTabChange(0)} startIcon={<TaskIcon />} sx={{ color: 'black' }}>
                        Tasks
                    </Button>
                    <IconButton color="inherit" onClick={handleProfileClick} sx={{ color: 'black' }}>
                        <PersonIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileClose}
                    >
                        <MenuItem>
                            <Typography variant="h6">Profile</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                            <Typography variant="body1">Name: {user.user_name}</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="body1">Email: {user.email}</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="body1">Role: {user.role}</Typography>
                        </MenuItem>
                    </Menu>
                    <IconButton color="inherit" onClick={handleLogout} sx={{ color: 'black' }}>
                        <LogoutIcon />
                    </IconButton>
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
