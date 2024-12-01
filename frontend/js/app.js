import { fetchTasks, addTask, deleteTask, updateTask } from './task.js';

// On page load, check if the user is logged in
window.onload = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // User is not logged in, show only the add task section
        document.getElementById('taskList').style.display = 'none';
        document.getElementById('addTaskSection').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'none'; // Hide logout button
        document.getElementById('loginLink').style.display = 'block'; // Show login link
        document.getElementById('registerLink').style.display = 'block'; // Show register link
    } else {
        // User is logged in, load tasks and show sections
        loadTasks(token);
        document.getElementById('taskList').style.display = 'block'; // Show task list
        document.getElementById('addTaskSection').style.display = 'block'; // Show add task section
        document.getElementById('logoutButton').style.display = 'block'; // Show logout button
        document.getElementById('loginLink').style.display = 'none'; // Hide login link
        document.getElementById('registerLink').style.display = 'none'; // Hide register link
    }
};

// Fetch tasks from the backend
async function loadTasks(token) {
    try {
        const tasks = await fetchTasks(token); // Fetch tasks from the server
        const taskContainer = document.getElementById('taskContainer');
        const noTasksMessage = document.getElementById('noTasksMessage');
        
        taskContainer.innerHTML = ''; // Clear existing tasks
        noTasksMessage.style.display = 'none'; // Hide the no tasks message initially

        if (Array.isArray(tasks) && tasks.length === 0) {
            // If the tasks array is empty, display the message
            noTasksMessage.style.display = 'block'; // Show the no tasks message
            return; // Exit the function
        }

        // If tasks are fetched successfully and not empty, proceed to display them
        tasks.forEach((task, index) => {
            const li = document.createElement('li');

            // Create and append title with numbering based on sorted order
            const title = document.createElement('h3');
            title.textContent = `Task ${index + 1}: ${task.title}`; // Numbering reflects sorted order
            li.appendChild(title);

            // Create and append description
            const description = document.createElement('p');
            description.textContent = task.description;
            li.appendChild(description);

            // Format and append due date (without time and timezone)
            const dueDate = document.createElement('span');
            const formattedDueDate = new Date(task.dueDate).toLocaleDateString(); // Format date
            dueDate.textContent = `Due: ${formattedDueDate}`;
            li.appendChild(dueDate);

            // Create and append priority
            const priority = document.createElement('span');
            priority.textContent = `Priority: ${task.priority}`;
            li.appendChild(priority);

            // Create and append status display and toggle button inline
            const statusContainer = document.createElement('span');
            statusContainer.innerHTML = `Status: <span class="statusDisplay">${task.status}</span>`;
            li.appendChild(statusContainer);

            const toggleStatusButton = document.createElement('button');
            toggleStatusButton.textContent = 'Update Status';
            toggleStatusButton.style.marginLeft = '10px'; // Add space between status and button
            toggleStatusButton.style.backgroundColor = 'gray'; // color
            toggleStatusButton.style.padding = '5px 10px'; // Add padding to make the button smaller
            toggleStatusButton.onclick = async () => {
                const newStatus = getNextStatus(task.status); // Function to determine the next status
                try {
                    const token = localStorage.getItem('token');
                    await updateTaskStatus(token, task._id, newStatus); // Function to update the task status on the server
                    statusContainer.querySelector('.statusDisplay').textContent = newStatus; // Update the displayed status
                } catch (error) {
                    showNotification(error.message, true);
                }
            };
            statusContainer.appendChild(toggleStatusButton); // Append button to the status container

            // Create and append delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = async () => {
                const confirmDelete = confirm('Are you sure you want to delete this task?'); // Confirmation dialog
                if (confirmDelete) { // Proceed only if confirmed
                    const token = localStorage.getItem('token');
                    try {
                        const message = await deleteTask(token, task._id); // Use the task's ID
                        showNotification(message);
                        loadTasks(token); // Refresh task list after deletion
                    } catch (error) {
                        showNotification(error.message, true);
                    }
                }
            };
            li.appendChild(deleteButton);

            taskContainer.appendChild(li);
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        // Optionally, you can show a generic error message if the fetch fails
        const noTasksMessage = document.getElementById('noTasksMessage');
        noTasksMessage.textContent = "Failed to load tasks. Please try again later."; // Optional error message
        noTasksMessage.style.display = 'block'; // Show the error message
    }
}

// Function to show notifications
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.color = isError ? 'red' : 'green'; // Change color based on error
    notification.style.display = 'block'; // Show the notification
    setTimeout(() => {
        notification.style.display = 'none'; // Hide after 3 seconds
    }, 3000);
}

// Add a new task
document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    const token = localStorage.getItem('token');

    if (!title || !description || !dueDate || !priority) {
        showNotification('Please fill in all fields.', true);
        return;
    }

    try {
        const newTask = await addTask(token, title, description, dueDate, priority);
        alert('Task added successfully');
        loadTasks(token); // Refresh task list after adding a task

        // Reset and clear the form
        document.getElementById('taskForm').reset(); // Reset the form fields
    } catch (error) {
        showNotification(`Error adding task: ${error.message}`, true);
    }
});

// Delete task
document.getElementById('deleteTaskButton')?.addEventListener('click', async () => {
    const taskId = task._id;  // You can get the task ID dynamically
    const token = localStorage.getItem('token');
    try {
        const message = await deleteTask(token, taskId);
        showNotification(message);
        loadTasks(token); // Refresh task list after deletion
    } catch (error) {
        showNotification(error.message, true);
    }
});

// Function to create a closure for managing status
function createStatusManager() {
    const statuses = ['pending', 'in-progress', 'completed'];
    let currentIndex = 0; // Start with the first status

    return function() {
        const nextStatus = statuses[currentIndex];
        currentIndex = (currentIndex + 1) % statuses.length; // Cycle through statuses
        return nextStatus;
    };
}

// Create an instance of the status manager
const getNextStatus = createStatusManager();

// Function to update the task status on the server
async function updateTaskStatus(token, taskId, newStatus) {
    // Implement the API call to update the task status
    // Example: await api.updateTaskStatus(token, taskId, { status: newStatus });
}

// Logout functionality
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    window.location.href = 'index.html'; // Redirect to the index page
});
