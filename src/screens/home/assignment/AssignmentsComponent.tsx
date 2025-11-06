import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { assignmentsList, Ticket } from '@services/ticketMockService';
import { useUserStore } from '@state/userStore';
import { getUserByEmail, User } from '@services/userService';

import DetailTicket from '@components/detailTicket/detailTicket';
import { getStatusColor, getStatusText } from '@utils/helpers';

interface EnrichedTicket extends Ticket {
  assignedUser?: User;
}

export default function AssignmentsComponent() {
  const user = useUserStore(state => state.user);
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  useEffect(() => {
    const loadAssignments = async () => {
      if (!user?.email) return;

      const myAssignments = await assignmentsList(user.email);

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
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Mis asignaciones</Text>
        <Text style={styles.empty}>Por favor, inicia sesión para ver tus asignaciones.</Text>
      </View>
    );
  }

  const handleChangeSubtaskStatus = useCallback(
    (subtaskId: string, newStatus: 'open' | 'in_progress' | 'closed') => {
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
    <View style={styles.container}>
      <Text style={styles.header}>Mis asignaciones</Text>

      {tickets.length === 0 ? (
        <Text style={styles.empty}>No tienes tareas asignadas 🎉</Text>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedTicket(item)}
              style={styles.item}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.description}</Text>

              <Text
                style={[styles.status, { color: getStatusColor(item.status) }]}
              >
                <Text style={{ fontWeight: 'bold' }}>Estado:</Text>{' '}
                {getStatusText(item.status)}
              </Text>
              <Text style={styles.date}>Asignado el {item.date}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <DetailTicket
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        handleChangeSubtaskStatus={handleChangeSubtaskStatus}
        myAssignments={true}
        user={user}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 12, color: '#333' },
  item: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  subtitle: { color: '#666', marginTop: 4 },
  status: { color: '#691085ff', marginTop: 6, fontWeight: '500' },
  date: { color: '#999', marginTop: 4, fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: 'gray' },
});
