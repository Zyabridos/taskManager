import { request } from '@playwright/test';
import encrypt from '../../../backend/server/lib/secure.cjs';

export default async function createTestUser() {
  const agent = await request.newContext({
    baseURL: 'http://localhost:5001',
  });

  const response = await agent.post('/api/users', {
    data: {
      email: 'testuser@example.com',
      password: 'qwerty',
      firstName: 'Test',
      lastName: 'User',
    },
  });

  if (response.status() !== 201 && response.status() !== 422) {
    throw new Error(`Can't create user: ${response.status()}`);
  }

  await agent.dispose();
}
