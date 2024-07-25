import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';


export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    user_name: "",
    email: "",
    password: "",
    role: ""
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { user_name, email, password, role } = data;
    try {
        const { data: responseData } = await axios.post("/register", { user_name, email, password, role });

        if (responseData.error) {
            toast.error(responseData.error);
        } else {
            const { user_id } = responseData;

            const userDetailsResponse = await axios.post("/api/userDetails", {
                user_id,
                user_name,
                email,
                role,
                ProjectDescription: []
            });

            if (userDetailsResponse.status === 201) {
                toast.success("Registration successful. Please login");

                setData({ user_name: "", email: "", password: "", role: "" });

                navigate('/');
            } else {
                toast.error("Failed to save user details. Please try again.");
            }
        }
    } catch (error) {
        console.log(error);
        toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
      >
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>
          <form onSubmit={registerUser}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              name="user_name"
              value={data.user_name}
              onChange={(e) => setData({ ...data, user_name: e.target.value })}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                label="role"
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
          <Box mt={2}>
            <Typography variant="body2">
              Already have an account? <Link to="/">Sign in</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
      </motion.div>
    </Container>
  );
}