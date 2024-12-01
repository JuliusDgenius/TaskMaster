// task router
const express = require('express');
const router = express.Router();
const { getTasks, addTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getTasks);
router.post('/tasks', authMiddleware, addTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);

module.exports = router;
