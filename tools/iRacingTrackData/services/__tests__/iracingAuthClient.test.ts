import { IRacingAuthClient } from '../iracingAuthClient';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('IRacingAuthClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should create an instance with username and encrypted secret', () => {
      const client = new IRacingAuthClient('test@example.com', 'password123');
      expect(client.username).toBe('test@example.com');
      expect(client.secret).toBeDefined();
      expect(typeof client.secret).toBe('string');
    });

    it('should set baseUrl from environment variable', () => {
      process.env.IRACING_BASE_URL = 'https://members-ng.iracing.com';
      const client = new IRacingAuthClient('test@example.com', 'password123');
      expect(client.baseUrl).toBe('https://members-ng.iracing.com');
    });
  });

  describe('generateToken', () => {
    it('should throw error when baseUrl is not defined', async () => {
      delete process.env.IRACING_BASE_URL;
      const client = new IRacingAuthClient('test@example.com', 'password123');

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: Iracing Base URL not defined.',
      );
    });

    it('should successfully generate token with valid credentials', async () => {
      process.env.IRACING_BASE_URL = 'https://members-ng.iracing.com';

      const mockResponse = {
        ok: true,
        headers: {
          getSetCookie: jest
            .fn()
            .mockReturnValue(['irsso_membersv2=cookie1', 'authtoken=cookie2']),
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient('test@example.com', 'password123');
      const token = await client.generateToken();

      expect(token).toBe('irsso_membersv2=cookie1; authtoken=cookie2');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://members-ng.iracing.com/auth',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: client.secret,
          }),
        },
      );
    });

    it('should throw error when response is not ok (405 Not Allowed)', async () => {
      process.env.IRACING_BASE_URL = 'https://members-ng.iracing.com';

      const mockResponse = {
        ok: false,
        status: 405,
        statusText: 'Not Allowed',
        headers: {
          get: jest.fn(),
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient('test@example.com', 'password123');

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: Unexpected auth error',
      );
    });

    it('should throw error when response is not ok (401 Unauthorized)', async () => {
      process.env.IRACING_BASE_URL = 'https://members-ng.iracing.com';

      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: {
          get: jest.fn(),
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient('test@example.com', 'password123');

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: Unexpected auth error',
      );
    });

    it('should throw error when response is not ok (500 Server Error)', async () => {
      process.env.IRACING_BASE_URL = 'https://members-ng.iracing.com';

      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          get: jest.fn(),
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient('test@example.com', 'password123');

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: Unexpected auth error',
      );
    });

    it('should throw error when setCookie header is missing', async () => {
      process.env.IRACING_BASE_URL = 'https://members-ng.iracing.com';

      const mockResponse = {
        ok: true,
        headers: {
          getSetCookie: jest.fn().mockReturnValue(null),
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient('test@example.com', 'password123');

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: Invalid Response Header',
      );
    });

    it('should throw error when setCookie header is empty array', async () => {
      process.env.IRACING_BASE_URL = 'https://members-ng.iracing.com';

      const mockResponse = {
        ok: true,
        headers: {
          getSetCookie: jest.fn().mockReturnValue([]),
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient('test@example.com', 'password123');

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: Invalid Response Header',
      );
    });

    it('should handle network errors', async () => {
      process.env.IRACING_BASE_URL = 'https://members-ng.iracing.com';

      mockFetch.mockRejectedValue(new Error('Network error'));

      const client = new IRacingAuthClient('test@example.com', 'password123');

      await expect(client.generateToken()).rejects.toThrow('Network error');
    });
  });

  describe('password encryption', () => {
    it('should generate consistent hash for same credentials', () => {
      const client1 = new IRacingAuthClient('test@example.com', 'password123');
      const client2 = new IRacingAuthClient('test@example.com', 'password123');

      expect(client1.secret).toBe(client2.secret);
    });

    it('should generate different hash for different passwords', () => {
      const client1 = new IRacingAuthClient('test@example.com', 'password123');
      const client2 = new IRacingAuthClient('test@example.com', 'different');

      expect(client1.secret).not.toBe(client2.secret);
    });

    it('should generate different hash for different usernames', () => {
      const client1 = new IRacingAuthClient('test1@example.com', 'password123');
      const client2 = new IRacingAuthClient('test2@example.com', 'password123');

      expect(client1.secret).not.toBe(client2.secret);
    });

    it('should lowercase username in hash calculation', () => {
      const client1 = new IRacingAuthClient('Test@Example.com', 'password123');
      const client2 = new IRacingAuthClient('test@example.com', 'password123');

      expect(client1.secret).toBe(client2.secret);
    });
  });
});
