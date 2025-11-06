import { useCallback } from 'react';
import { Ticket, TicketStatus } from '@services/ticketMockService';


type SetSelectedTicket = React.Dispatch<React.SetStateAction<Ticket | null>>;

export function useSubtaskStatus(setSelectedTicket: SetSelectedTicket) {
  const handleChangeSubtaskStatus = useCallback(
    (subtaskId: string, newStatus: TicketStatus) => {
      setSelectedTicket(prevTicket => {
        if (!prevTicket) return prevTicket;
        const updatedSubtasks = prevTicket.subtasks
          ? prevTicket.subtasks.map(st =>
              st.id === subtaskId ? { ...st, status: newStatus } : st,
            )
          : [];
        return { ...prevTicket, subtasks: updatedSubtasks };
      });
    },
    [setSelectedTicket],
  );
  return { handleChangeSubtaskStatus };
}