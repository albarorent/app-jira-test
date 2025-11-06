import { useEffect, useState } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getTickets, Ticket } from '@services/ticketMockService';
import { getUserByEmail, User } from '@services/userService';
import { useUserStore } from '@state/userStore';
import { getStatusColor, getStatusText } from '@utils/helpers';

interface TicketListProps {
  onSelectTicket: (ticket: Ticket) => void;
}

interface EnrichedTicket extends Ticket {
  assignedUser?: User;
}

export default function TicketList({ onSelectTicket }: TicketListProps) {
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useUserStore(state => state.user);

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
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#691085ff"
        style={{ marginTop: 40 }}
      />
    );
  }

  return (
    <FlatList
      data={tickets}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        const isMine = item.assignedTo === currentUser?.email;
        const borderColor = isMine
          ? currentUser?.color || '#691085ff'
          : '#f3f3f3';

        return (
          <TouchableOpacity
            style={[
              styles.item,
              { borderLeftColor: borderColor, borderLeftWidth: 6 },
            ]}
            onPress={() => onSelectTicket(item)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>
              {item.assignedUser?.name ?? item.assignedTo}
            </Text>
            <Text
              style={[styles.status, { color: getStatusColor(item.status) }]}
            >
              <Text style={{ fontWeight: 'bold' }}>Estado:</Text>{' '}
              {getStatusText(item.status)}
            </Text>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <Text style={styles.empty}>No hay tickets disponibles</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    borderLeftWidth: 6,
  },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  subtitle: { color: '#666', marginTop: 4 },
  status: { color: '#691085ff', marginTop: 6, fontWeight: '500' },
  empty: { textAlign: 'center', marginTop: 20, color: 'gray' },
});
