// Function to fetch tasks for the authenticated user
export async function fetchTasks(token) {
    try {
        const response = await fetch('http://localhost:3000/taskController/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Fetch error details:', {
                status: response.status,
                statusText: response.statusText,
                errorData: errorData
            });
            throw new Error(errorData.error || 'Failed to fetch tasks');
        }

        const data = await response.json();
        
        // Check if tasks exist and return accordingly
        if (data && Array.isArray(data.tasks)) {
            return data.tasks;  // Return tasks if they exist
        } else {
            console.warn('No tasks found for the user.'); // Log a warning if no tasks are found
            return [];  // Return an empty array if no tasks are found
        }
    } catch (error) {
        // Enhanced error handling
        if (error instanceof TypeError) {
            console.error('Network error or invalid JSON:', error);
            throw new Error('Network error or invalid response from server.');
        } else {
            console.error('Error fetching tasks:', error);
            throw error; // Re-throw or handle it accordingly
        }
    }
}

// Function to add a new task
export async function addTask(token, title, description, dueDate, priority) {
    const response = await fetch('http://localhost:3000/taskController/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, dueDate, priority }),
    });

    const data = await response.json();
    if (response.ok) {
        return data.task;  // Returns the newly created task
    } else {
        throw new Error(data.error || 'Failed to add task');
    }
}

// Function to delete a task
export async function deleteTask(token, taskId) {
    const response = await fetch(`http://localhost:3000/taskController/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (response.ok) {
        return data.message;  // Success message (e.g., "Task deleted successfully")
    } else {
        throw new Error(data.error || 'Failed to delete task');
    }
    return 'Task deleted successfully';
}

// Function to update a task (for example, updating task status or details)
export async function updateTask(token, taskId, updatedData) {
    const response = await fetch(`http://localhost:3000/taskController/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (response.ok) {
        return data.task;  // Returns the updated task
    } else {
        throw new Error(data.error || 'Failed to update task');
    }
}
