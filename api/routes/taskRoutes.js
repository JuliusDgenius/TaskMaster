// task router
const express = require('express');
const router = express.Router();
const { getTasks, addTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

router.get('/api/v1/tasks', authMiddleware, getTasks);
router.post('/api/v1/tasks', authMiddleware, addTask);
router.delete('/api/v1/tasks/:id', authMiddleware, deleteTask);

module.exports = router;
