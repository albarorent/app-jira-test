export interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'lead' | 'tester';
}

const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Carlos Gómez',
    email: 'cgomez@test.cl',
    role: 'developer',
  },
  {
    id: 'u2',
    name: 'María Pérez',
    email: 'mperez@test.cl',
    role: 'developer',
  },
  {
    id: 'u3',
    name: 'Luis Torres',
    email: 'ltorres@test.cl',
    role: 'developer',
  },
  {
    id: 'u4',
    name: 'Daniel Arce',
    email: 'arcedaniel@gmail.com',
    role: 'lead',
  },
];

export const getUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 400);
  });
};

export const getUserByEmail = (email: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      resolve(user);
    }, 300);
  });
};

export const getUserById = (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === id);
      resolve(user);
    }, 300);
  });
};

export const loginMock = (email: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      resolve(user || null);
    }, 500);
  });
};
