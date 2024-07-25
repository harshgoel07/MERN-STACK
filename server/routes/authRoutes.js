// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, fetchAllUsers, getUsers } = require('../controllers/authControllers');

router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

router.get('/', test);
router.get('/fetchAllUsers', fetchAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getUsers); // Ensure this line uses a defined function

module.exports = router;
