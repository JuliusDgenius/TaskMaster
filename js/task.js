// Function to fetch tasks for the authenticated user
export async function fetchTasks(token) {
    try {
        const response = await fetch('https://your-vercel-url/api/v1/tasks', {
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
        
        if (data && Array.isArray(data.tasks)) {
            return data.tasks;
        } else {
            console.warn('No tasks found for the user.');
            return [];
        }
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('Network error or invalid JSON:', error);
            throw new Error('Network error or invalid response from server.');
        } else {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }
}

// Function to add a new task
export async function addTask(token, title, description, dueDate, priority) {
    const response = await fetch('https://task-master-nine-psi.vercel.app/api/v1/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, dueDate, priority }),
    });

    const data = await response.json();
    if (response.ok) {
        return data.task;
    } else {
        throw new Error(data.error || 'Failed to add task');
    }
}

// Function to delete a task
export async function deleteTask(token, taskId) {
    const response = await fetch(`https://task-master-nine-psi.vercel.app/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (response.ok) {
        return data.message;
    } else {
        throw new Error(data.error || 'Failed to delete task');
    }
}

// Function to update a task
export async function updateTask(token, taskId, updatedData) {
    const response = await fetch(`https://task-master-nine-psi.vercel.app/api/v1/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (response.ok) {
        return data.task;
    } else {
        throw new Error(data.error || 'Failed to update task');
    }
}
