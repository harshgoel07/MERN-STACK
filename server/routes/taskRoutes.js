// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { createTask, getTasks, getTaskById, updateTask, deleteTask, getTasksByOwnerId, deleteTasksByProjectId } = require('../controllers/taskController');

router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks/owner/:ownerId', getTasksByOwnerId);
router.delete('/tasks/project/:projectId', deleteTasksByProjectId);

module.exports = router;
