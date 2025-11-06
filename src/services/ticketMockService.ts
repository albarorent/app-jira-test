export interface Ticket {
  id: string;
  assignedTo: string;
  title: string;
  description: string;
  status: TicketStatus;
  date: string;
  subtasks?: Ticket[];
}

export type TicketStatus = 'open' | 'in_progress' | 'closed' | 'done' | 'cancel' | 'pending' | 'blocked';

const mockTickets: Ticket[] = [
  {
    id: '1',
    assignedTo: 'cgomez@test.cl',
    title: 'Error en autenticación',
    description: 'Los usuarios no pueden iniciar sesión correctamente.',
    status: 'open',
    date: '2025-10-29',
    subtasks: [
      {
        id: '1-1',
        assignedTo: '',
        title: 'Revisar logs del servidor',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-2',
        assignedTo: '',
        title: 'Probar con diferentes navegadores',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-3',
        assignedTo: '',
        title: 'Verificar configuración de la base de datos',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-4',
        assignedTo: '',
        title: 'Implementar solución temporal',
        description: '',
        status: 'open',
        date: '',
      },
    ],
  },
  {
    id: '2',
    assignedTo: 'mperez@test.cl',
    title: 'Actualización de dependencias',
    description:
      'Actualizar dependencias de React Native a la última versión estable.',
    status: 'in_progress',
    date: '2025-10-28',
    subtasks: [
      {
        id: '1-1',
        assignedTo: '',
        title: 'Revisar logs del servidor',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-2',
        assignedTo: '',
        title: 'Probar con diferentes navegadores',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-3',
        assignedTo: '',
        title: 'Verificar configuración de la base de datos',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-4',
        assignedTo: '',
        title: 'Implementar solución temporal',
        description: '',
        status: 'open',
        date: '',
      },
    ],
  },
  {
    id: '3',
    assignedTo: 'ltorres@test.cl',
    title: 'Optimizar carga de imágenes',
    description:
      'Mejorar tiempos de carga de imágenes en el módulo de galería.',
    status: 'closed',
    date: '2025-10-27',
    subtasks: [
      {
        id: '1-1',
        assignedTo: '',
        title: 'Revisar logs del servidor',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-2',
        assignedTo: '',
        title: 'Probar con diferentes navegadores',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-3',
        assignedTo: '',
        title: 'Verificar configuración de la base de datos',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-4',
        assignedTo: '',
        title: 'Implementar solución temporal',
        description: '',
        status: 'open',
        date: '',
      },
    ],
  },
  {
    id: '4',
    assignedTo: 'arcedaniel@gmail.com',
    title: 'Estructurar proyecto',
    description: 'Crear el proyecto',
    status: 'closed',
    date: '2025-10-27',
    subtasks: [
      {
        id: '1-1',
        assignedTo: '',
        title: 'Revisar logs del servidor',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-2',
        assignedTo: '',
        title: 'Probar con diferentes navegadores',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-3',
        assignedTo: '',
        title: 'Verificar configuración de la base de datos',
        description: '',
        status: 'open',
        date: '',
      },
      {
        id: '1-4',
        assignedTo: '',
        title: 'Implementar solución temporal',
        description: '',
        status: 'open',
        date: '',
      },
    ],
  },
];

export const getTickets = (): Promise<Ticket[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockTickets);
    }, 500);
  });
};

export const getTicketId = (id: string): Promise<Ticket | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const ticket = mockTickets.find(t => t.id === id) || null;
      resolve(ticket);
    }, 300);
  });
}

export const assignmentsList = (email: string): Promise<Ticket[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const assigned = mockTickets.filter(t => t.assignedTo === email);
      resolve(assigned);
    }, 400);
  });
};

export const updateTicketStatus = (
  id: string,
  newStatus: Ticket['status']
): Promise<Ticket | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const idx = mockTickets.findIndex(t => t.id === id);
      if (idx === -1) return resolve(null);
      mockTickets[idx] = {
        ...mockTickets[idx],
        status: newStatus,
      };
      resolve(mockTickets[idx]);
    }, 200);
  });
};