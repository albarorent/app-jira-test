import { delay } from '@utils/delay';

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(1000);

    if (email === 'test@example.com' && password === '123456') {
      return {
        token: 'mock-jwt-token-12345',
        user: {
          name: 'Usuario Demo',
          email,
        },
      };
    }

    throw new Error('Credenciales inválidas');
  },

  async logout(): Promise<void> {
    await delay(500);
  },
};
