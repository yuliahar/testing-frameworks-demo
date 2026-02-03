const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

describe('API Health Check', () => {
  test('GET /api/health should return status ok', async () => {
    const response = await api.get('/health');
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('status', 'ok');
    expect(response.data).toHaveProperty('timestamp');
  });
});

describe('Users API - GET Operations', () => {
  beforeEach(async () => {
    // Reset users before each test
    await api.post('/users/reset');
  });

  test('GET /api/users should return all users', async () => {
    const response = await api.get('/users');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('GET /api/users/:id should return a specific user', async () => {
    const response = await api.get('/users/1');
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', 1);
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('email');
  });

  test('GET /api/users/:id should return 404 for non-existent user', async () => {
    try {
      await api.get('/users/9999');
      fail('Expected 404 error');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toHaveProperty('error', 'User not found');
    }
  });
});

describe('Users API - POST Operations', () => {
  beforeEach(async () => {
    await api.post('/users/reset');
  });

  test('POST /api/users should create a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      age: 28
    };

    const response = await api.post('/users', newUser);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.name).toBe(newUser.name);
    expect(response.data.email).toBe(newUser.email);
    expect(response.data.age).toBe(newUser.age);
  });

  test('POST /api/users should fail without required fields', async () => {
    const invalidUser = {
      name: 'Test User'
      // Missing email
    };

    try {
      await api.post('/users', invalidUser);
      fail('Expected 400 error');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('error', 'Name and email are required');
    }
  });

  test('POST /api/users should fail with duplicate email', async () => {
    const user = {
      name: 'Duplicate User',
      email: 'john@example.com', // This email already exists
      age: 30
    };

    try {
      await api.post('/users', user);
      fail('Expected 409 error');
    } catch (error) {
      expect(error.response.status).toBe(409);
      expect(error.response.data).toHaveProperty('error', 'Email already exists');
    }
  });

  test('POST /api/users should fail with invalid age', async () => {
    const invalidUser = {
      name: 'Test User',
      email: 'test@example.com',
      age: 200 // Invalid age
    };

    try {
      await api.post('/users', invalidUser);
      fail('Expected 400 error');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('error', 'Invalid age');
    }
  });
});

describe('Users API - PUT Operations', () => {
  beforeEach(async () => {
    await api.post('/users/reset');
  });

  test('PUT /api/users/:id should update an existing user', async () => {
    const updatedData = {
      name: 'Updated Name',
      email: 'updated@example.com',
      age: 35
    };

    const response = await api.put('/users/1', updatedData);
    
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
    expect(response.data.name).toBe(updatedData.name);
    expect(response.data.email).toBe(updatedData.email);
    expect(response.data.age).toBe(updatedData.age);
  });

  test('PUT /api/users/:id should return 404 for non-existent user', async () => {
    const updatedData = {
      name: 'Updated Name',
      email: 'updated@example.com'
    };

    try {
      await api.put('/users/9999', updatedData);
      fail('Expected 404 error');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toHaveProperty('error', 'User not found');
    }
  });

  test('PUT /api/users/:id should fail with duplicate email', async () => {
    const updatedData = {
      email: 'jane@example.com' // This email belongs to user 2
    };

    try {
      await api.put('/users/1', updatedData);
      fail('Expected 409 error');
    } catch (error) {
      expect(error.response.status).toBe(409);
      expect(error.response.data).toHaveProperty('error', 'Email already exists');
    }
  });
});

describe('Users API - DELETE Operations', () => {
  beforeEach(async () => {
    await api.post('/users/reset');
  });

  test('DELETE /api/users/:id should delete a user', async () => {
    const response = await api.delete('/users/1');
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', 'User deleted successfully');
    expect(response.data).toHaveProperty('user');

    // Verify user is deleted
    try {
      await api.get('/users/1');
      fail('Expected 404 error');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('DELETE /api/users/:id should return 404 for non-existent user', async () => {
    try {
      await api.delete('/users/9999');
      fail('Expected 404 error');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toHaveProperty('error', 'User not found');
    }
  });
});

describe('Users API - Integration Flow', () => {
  beforeEach(async () => {
    await api.post('/users/reset');
  });

  test('Complete CRUD flow for a user', async () => {
    // CREATE
    const newUser = {
      name: 'Integration Test User',
      email: 'integration@example.com',
      age: 25
    };
    
    const createResponse = await api.post('/users', newUser);
    expect(createResponse.status).toBe(201);
    const userId = createResponse.data.id;
    expect(userId).toBeDefined();

    // READ
    const readResponse = await api.get(`/users/${userId}`);
    expect(readResponse.status).toBe(200);
    expect(readResponse.data.name).toBe(newUser.name);

    // UPDATE
    const updatedData = {
      name: 'Updated Integration User',
      age: 30
    };
    const updateResponse = await api.put(`/users/${userId}`, updatedData);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.name).toBe(updatedData.name);
    expect(updateResponse.data.age).toBe(updatedData.age);

    // DELETE
    const deleteResponse = await api.delete(`/users/${userId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data.message).toBe('User deleted successfully');

    // VERIFY DELETION
    try {
      await api.get(`/users/${userId}`);
      fail('Expected 404 error');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
