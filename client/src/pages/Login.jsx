import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, AppBar, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import { loginUser } from '../actions/authAction';
import axios from 'axios';
import { styled } from '@mui/system';
import './style.css';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error, user } = useSelector(state => state.user);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'user') {
        navigate('/user');
      }
    }

    if (error) {
      toast.error(error);
    }
  }, [isAuthenticated, error, user, navigate]);

  const login = (e) => {
    e.preventDefault();
    dispatch(loginUser(data));
  };

  const Logo = styled('img')({
    height: 55,
  });

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#FFB347', padding: 0, margin: 0 }}>
        <Toolbar sx={{ padding: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 0, margin: 0 }}>
            <Logo
              sx={{ display: 'flex', alignItems: 'center', padding: 0, margin: 0 }}
              src="https://www.tigeranalytics.com/wp-content/uploads/2023/09/TA-Logo-resized-for-website_.png"
              alt="Tiger Analytics Logo" />
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ marginTop: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
            <form onSubmit={login}>
              <TextField
                label="Email"
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                fullWidth
                margin="normal"
                className="textfield-custom"
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                fullWidth
                margin="normal"
                className="textfield-custom"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="button-custom"
              >
                Login
              </Button>
            </form>
            <Box mt={2}>
              <Typography variant="body2">
                Don't have an account? <Link to="/register">Register here</Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </>
  );
}
