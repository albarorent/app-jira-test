import { assignmentsList } from '@services/ticketMockService';
import { getUserByEmail } from '@services/userService';
import { useEffect, useState } from 'react';
import { EnrichedTicket } from './useLoadTicket';

export const useLoadAssignments = (email: string, status: string) => {
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      if (!email) return;

      const myAssignments = await assignmentsList(email);

      const enriched = await Promise.all(
        myAssignments.map(async t => {
          const assignedUser = await getUserByEmail(t.assignedTo);
          return { ...t, assignedUser };
        }),
      );

      setTickets(enriched);
      setLoading(false);
    };

    loadAssignments();
  }, [email, status]);

  return {
    tickets,
    loading,
  };
};
