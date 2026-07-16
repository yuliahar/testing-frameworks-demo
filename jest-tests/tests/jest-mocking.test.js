/**
 * Jest Mocking, Stubbing & Spying — Advanced Examples
 * Demonstrates: jest.fn(), jest.mock(), jest.spyOn(), mockResolvedValue,
 * mockImplementation, call order assertions, partial matching.
 * Required pattern for ParkChirp: "In-depth experience with Jest stubbing, mocking, and spying"
 */
const axios = require('axios');

// ── Service layer (the code under test) ─────────────────────
class UserService {
  constructor(httpClient) {
    this.http = httpClient || axios;
    this.baseUrl = process.env.API_URL || 'http://localhost:3000/api';
  }
  async getUsers() {
    const res = await this.http.get(`${this.baseUrl}/users`);
    return res.data;
  }
  async getUserById(id) {
    const res = await this.http.get(`${this.baseUrl}/users/${id}`);
    return res.data;
  }
  async createUser(data) {
    const res = await this.http.post(`${this.baseUrl}/users`, data);
    return res.data;
  }
  async deleteUser(id) {
    await this.http.delete(`${this.baseUrl}/users/${id}`);
    return true;
  }
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  sanitizeInput(raw) {
    return raw.trim().replace(/<[^>]*>/g, '');
  }
}

jest.mock('axios');

describe('Jest Mocking, Stubbing & Spying', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService(axios);
  });

  // ── MOCKING ────────────────────────────────────────────────
  describe('Mock: axios HTTP calls', () => {
    test('GET /users returns stubbed list', async () => {
      const mockUsers = [
        { id: 1, name: 'Alice', email: 'alice@test.com' },
        { id: 2, name: 'Bob',   email: 'bob@test.com' },
      ];
      axios.get.mockResolvedValueOnce({ data: mockUsers });

      const users = await service.getUsers();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/users'));
      expect(users).toHaveLength(2);
      expect(users[0].name).toBe('Alice');
    });

    test('POST /users returns created resource', async () => {
      const payload = { name: 'Charlie', email: 'charlie@test.com', age: 28 };
      axios.post.mockResolvedValueOnce({ data: { id: 3, ...payload } });

      const result = await service.createUser(payload);

      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/users'), payload);
      expect(result).toMatchObject(payload);
      expect(result.id).toBeDefined();
    });

    test('DELETE /users/:id resolves to true', async () => {
      axios.delete.mockResolvedValueOnce({ data: {} });
      const result = await service.deleteUser(1);
      expect(result).toBe(true);
    });
  });

  // ── ERROR MOCKING ──────────────────────────────────────────
  describe('Mock: error & edge cases', () => {
    test('network error propagates from GET', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network Error'));
      await expect(service.getUsers()).rejects.toThrow('Network Error');
    });

    test('404 response shape preserved for missing user', async () => {
      const err = { response: { status: 404, data: { error: 'Not found' } } };
      axios.get.mockRejectedValueOnce(err);
      await expect(service.getUserById(9999)).rejects.toMatchObject({
        response: { status: 404 },
      });
    });

    test('multiple sequential mock responses (queue)', async () => {
      axios.get
        .mockResolvedValueOnce({ data: [{ id: 1, name: 'First call' }] })
        .mockResolvedValueOnce({ data: [{ id: 2, name: 'Second call' }] });

      const first  = await service.getUsers();
      const second = await service.getUsers();

      expect(first[0].name).toBe('First call');
      expect(second[0].name).toBe('Second call');
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  // ── SPYING ─────────────────────────────────────────────────
  describe('Spy: observe real implementation', () => {
    test('validateEmail called with correct argument and returns true', () => {
      const spy = jest.spyOn(service, 'validateEmail');
      const result = service.validateEmail('valid@email.com');
      expect(spy).toHaveBeenCalledWith('valid@email.com');
      expect(result).toBe(true);
      spy.mockRestore();
    });

    test('sanitizeInput strips HTML tags and trims whitespace', () => {
      const spy = jest.spyOn(service, 'sanitizeInput');
      const result = service.sanitizeInput('  <script>alert(1)</script>Hello  ');
      expect(spy).toHaveBeenCalled();
      expect(result).toBe('Hello');
      spy.mockRestore();
    });

    test('spy tracks call count across multiple invocations', () => {
      const spy = jest.spyOn(service, 'validateEmail');
      service.validateEmail('a@a.com');
      service.validateEmail('b@b.com');
      service.validateEmail('invalid');
      expect(spy).toHaveBeenCalledTimes(3);
      spy.mockRestore();
    });
  });

  // ── STUBBING ───────────────────────────────────────────────
  describe('Stub: replace implementation', () => {
    test('stub validateEmail to always return false (block validation)', () => {
      jest.spyOn(service, 'validateEmail').mockReturnValue(false);
      expect(service.validateEmail('any@email.com')).toBe(false);
    });

    test('mockImplementation simulates async processing', async () => {
      jest.spyOn(service, 'createUser').mockImplementation(async (data) => {
        await new Promise((r) => setTimeout(r, 10));
        return { id: 99, ...data, createdAt: new Date().toISOString() };
      });
      const result = await service.createUser({ name: 'Stub', email: 's@s.com', age: 1 });
      expect(result.id).toBe(99);
      expect(result.createdAt).toBeDefined();
    });
  });

  // ── CALL ORDER & COUNT ─────────────────────────────────────
  describe('Assertions: call order and isolation', () => {
    test('createUser does NOT call GET', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 1 } });
      await service.createUser({ name: 'X', email: 'x@x.com', age: 1 });
      expect(axios.get).not.toHaveBeenCalled();
    });

    test('mocks are isolated between tests — no bleed-through', async () => {
      // If clearAllMocks works, this GET mock from previous test is gone
      axios.get.mockResolvedValueOnce({ data: [] });
      const result = await service.getUsers();
      expect(result).toEqual([]);
    });
  });

  // ── PARTIAL MATCHING ───────────────────────────────────────
  describe('Assertions: objectContaining / arrayContaining', () => {
    test('objectContaining validates response subset', async () => {
      axios.post.mockResolvedValueOnce({
        data: { id: 5, name: 'Partial', email: 'p@p.com', age: 22, createdAt: '2025-01-01' },
      });
      const result = await service.createUser({ name: 'Partial', email: 'p@p.com', age: 22 });
      expect(result).toEqual(expect.objectContaining({ name: 'Partial', email: 'p@p.com' }));
    });

    test('arrayContaining validates partial list match', async () => {
      axios.get.mockResolvedValueOnce({
        data: [
          { id: 1, name: 'Alice', email: 'a@a.com' },
          { id: 2, name: 'Bob',   email: 'b@b.com' },
        ],
      });
      const users = await service.getUsers();
      expect(users).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'Alice' })])
      );
    });
  });
});
