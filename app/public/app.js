// API Base URL
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const userForm = document.getElementById('userForm');
const usersList = document.getElementById('usersList');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');
const userIdInput = document.getElementById('userId');

// State
let editMode = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    userForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
    refreshBtn.addEventListener('click', loadUsers);
});

// Load all users
async function loadUsers() {
    try {
        usersList.innerHTML = '<div class="loading">Loading users...</div>';
        const response = await fetch(`${API_URL}/users`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        usersList.innerHTML = '<div class="loading">Error loading users</div>';
        showMessage('Failed to load users: ' + error.message, 'error');
    }
}

// Display users in the list
function displayUsers(users) {
    if (users.length === 0) {
        usersList.innerHTML = '<div class="loading">No users found. Add one to get started!</div>';
        return;
    }
    
    usersList.innerHTML = users.map(user => `
        <div class="user-card" data-user-id="${user.id}">
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Age:</strong> ${user.age !== null ? user.age : 'N/A'}</p>
            <div class="user-actions">
                <button class="btn btn-edit" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const age = document.getElementById('userAge').value;
    
    const userData = {
        name,
        email,
        age: age ? parseInt(age) : null
    };
    
    try {
        if (editMode) {
            await updateUser(userIdInput.value, userData);
        } else {
            await createUser(userData);
        }
    } catch (error) {
        showMessage('Operation failed: ' + error.message, 'error');
    }
}

// Create new user
async function createUser(userData) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
    }
    
    const newUser = await response.json();
    showMessage(`User "${newUser.name}" created successfully!`, 'success');
    userForm.reset();
    loadUsers();
}

// Update existing user
async function updateUser(userId, userData) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
    }
    
    const updatedUser = await response.json();
    showMessage(`User "${updatedUser.name}" updated successfully!`, 'success');
    cancelEdit();
    loadUsers();
}

// Edit user
async function editUser(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        
        if (!response.ok) {
            throw new Error('User not found');
        }
        
        const user = await response.json();
        
        // Fill form with user data
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userAge').value = user.age || '';
        userIdInput.value = user.id;
        
        // Update UI
        editMode = true;
        submitBtn.textContent = 'Update User';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to form
        userForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        showMessage('Failed to load user: ' + error.message, 'error');
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        
        const result = await response.json();
        showMessage(result.message, 'success');
        loadUsers();
    } catch (error) {
        showMessage('Failed to delete user: ' + error.message, 'error');
    }
}

// Cancel edit mode
function cancelEdit() {
    editMode = false;
    userForm.reset();
    userIdInput.value = '';
    submitBtn.textContent = 'Add User';
    cancelBtn.style.display = 'none';
}

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
    
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

// Make functions global for onclick handlers
window.editUser = editUser;
window.deleteUser = deleteUser;
