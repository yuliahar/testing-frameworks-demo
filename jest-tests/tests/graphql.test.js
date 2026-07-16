/**
 * GraphQL API Testing — Queries, Mutations, Mocking
 * Demonstrates patterns used in GraphQL/React apps like ParkChirp.
 * Covers: query structure, mutation variables, error handling, network mocking.
 */
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

// ── GraphQL client mock (simulates Apollo/urql client) ──────
const gqlClient = {
  query: jest.fn(),
  mutate: jest.fn(),
};

// ── GraphQL operation strings ────────────────────────────────
const GET_USERS = `
  query GetUsers {
    users { id name email age }
  }
`;
const GET_USER_BY_ID = `
  query GetUser($id: ID!) {
    user(id: $id) { id name email age }
  }
`;
const CREATE_USER = `
  mutation CreateUser($name: String!, $email: String!, $age: Int!) {
    createUser(name: $name, email: $email, age: $age) { id name email age }
  }
`;
const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) { success message }
  }
`;

// ── Helpers ──────────────────────────────────────────────────
function mockGQLSuccess(client, method, data) {
  client[method].mockResolvedValueOnce({ data, errors: undefined });
}
function mockGQLError(client, method, message, code = 'INTERNAL_ERROR') {
  client[method].mockResolvedValueOnce({
    data: null,
    errors: [{ message, extensions: { code } }],
  });
}

describe('GraphQL Query Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GetUsers query', () => {
    test('returns populated users array', async () => {
      mockGQLSuccess(gqlClient, 'query', {
        users: [
          { id: '1', name: 'Alice', email: 'alice@example.com', age: 28 },
          { id: '2', name: 'Bob',   email: 'bob@example.com',   age: 32 },
        ],
      });

      const result = await gqlClient.query({ query: GET_USERS });

      expect(gqlClient.query).toHaveBeenCalledWith({ query: GET_USERS });
      expect(result.data.users).toHaveLength(2);
      expect(result.data.users[0]).toMatchObject({ name: 'Alice' });
      expect(result.errors).toBeUndefined();
    });

    test('returns empty array when no users exist', async () => {
      mockGQLSuccess(gqlClient, 'query', { users: [] });
      const result = await gqlClient.query({ query: GET_USERS });
      expect(result.data.users).toEqual([]);
    });
  });

  describe('GetUser by ID query', () => {
    test('returns single user for valid ID', async () => {
      mockGQLSuccess(gqlClient, 'query', {
        user: { id: '1', name: 'Alice', email: 'alice@example.com', age: 28 },
      });

      const result = await gqlClient.query({ query: GET_USER_BY_ID, variables: { id: '1' } });

      expect(gqlClient.query).toHaveBeenCalledWith({
        query: GET_USER_BY_ID,
        variables: { id: '1' },
      });
      expect(result.data.user.name).toBe('Alice');
    });

    test('returns null user for non-existent ID', async () => {
      mockGQLSuccess(gqlClient, 'query', { user: null });
      const result = await gqlClient.query({ query: GET_USER_BY_ID, variables: { id: '9999' } });
      expect(result.data.user).toBeNull();
    });
  });

  describe('Authentication errors', () => {
    test('returns UNAUTHENTICATED error when token missing', async () => {
      mockGQLError(gqlClient, 'query', 'Not authenticated', 'UNAUTHENTICATED');
      const result = await gqlClient.query({ query: GET_USERS });
      expect(result.errors[0].extensions.code).toBe('UNAUTHENTICATED');
      expect(result.data).toBeNull();
    });
  });
});

describe('GraphQL Mutation Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('CreateUser mutation', () => {
    test('creates user and returns new record', async () => {
      const vars = { name: 'Charlie', email: 'charlie@example.com', age: 25 };
      mockGQLSuccess(gqlClient, 'mutate', { createUser: { id: '3', ...vars } });

      const result = await gqlClient.mutate({ mutation: CREATE_USER, variables: vars });

      expect(gqlClient.mutate).toHaveBeenCalledWith({
        mutation: CREATE_USER,
        variables: vars,
      });
      expect(result.data.createUser.id).toBe('3');
      expect(result.data.createUser).toMatchObject(vars);
    });

    test('returns validation error for missing required variable', async () => {
      mockGQLError(
        gqlClient, 'mutate',
        'Variable "$name" of required type "String!" was not provided.',
        'BAD_USER_INPUT'
      );

      const result = await gqlClient.mutate({
        mutation: CREATE_USER,
        variables: { email: 'no-name@example.com', age: 25 },
      });

      expect(result.errors[0].message).toContain('name');
      expect(result.errors[0].extensions.code).toBe('BAD_USER_INPUT');
    });

    test('returns validation error for duplicate email', async () => {
      mockGQLError(gqlClient, 'mutate', 'Email already exists', 'DUPLICATE_ENTRY');
      const result = await gqlClient.mutate({
        mutation: CREATE_USER,
        variables: { name: 'Dup', email: 'existing@example.com', age: 30 },
      });
      expect(result.errors[0].message).toContain('Email already exists');
    });
  });

  describe('DeleteUser mutation', () => {
    test('deletes user and returns success', async () => {
      mockGQLSuccess(gqlClient, 'mutate', {
        deleteUser: { success: true, message: 'User deleted' },
      });

      const result = await gqlClient.mutate({ mutation: DELETE_USER, variables: { id: '1' } });

      expect(result.data.deleteUser.success).toBe(true);
    });

    test('returns error for non-existent user', async () => {
      mockGQLError(gqlClient, 'mutate', 'User not found', 'NOT_FOUND');
      const result = await gqlClient.mutate({ mutation: DELETE_USER, variables: { id: '9999' } });
      expect(result.errors[0].extensions.code).toBe('NOT_FOUND');
    });
  });
});

describe('GraphQL Network Layer (REST endpoint)', () => {
  const api = axios.create({ baseURL: API_BASE_URL, timeout: 5000 });

  test('REST users endpoint returns GraphQL-compatible shape', async () => {
    try {
      const response = await api.get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      if (response.data.length > 0) {
        const user = response.data[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
      }
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        console.log('Server offline — skipping live network test');
        return;
      }
      throw err;
    }
  });
});
