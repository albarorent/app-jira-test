import { getTickets, Ticket } from '@services/ticketMockService';
import { getUserByEmail, User } from '@services/userService';
import { useEffect, useState } from 'react';

export interface EnrichedTicket extends Ticket {
  assignedUser?: User;
}

export const useLoadTicket = (status?: string) => {
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      const allTickets = await getTickets();

      const enrichedTickets = await Promise.all(
        allTickets.map(async t => {
          const user = await getUserByEmail(t.assignedTo);
          return { ...t, assignedUser: user };
        }),
      );

      setTickets(enrichedTickets);
      setLoading(false);
    };

    loadTickets();
  }, [status]);

  return { tickets, loading };
};
