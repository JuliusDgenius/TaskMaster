// Task Controller
const Task = require('../models/task');

// Get all tasks for a user
exports.getTasks = async (req, res) => { 
  try {
    // Check if userId is available
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    const tasks = await Task.find({ userId: req.user.userId });

    // Handle case where no tasks are found
    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    res.json({ tasks }); // Wrap tasks in an object
  } catch (error) {
    console.error('Error fetching tasks:', error); // Added logging
    res.status(500).json({ error: error.message });
  }
};


// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    if (!title || !description || !dueDate || !priority) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if userId is available
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      userId: req.user.userId,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // Get taskId from request parameters

    // Check if userId is available
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });

    // Handle case where task is not found
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error); // Added logging
    res.status(500).json({ error: error.message });
  }
};



