import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ticket } from '@services/ticketMockService';
import { useUserStore } from '@state/userStore';

import DetailTicket from '@components/detailTicket/detailTicket';
import { getStatusColor, getStatusText } from '@utils/helpers';
import { useSubtaskStatus } from '@hooks/useChangeSubtaskStatus';
import { useStatusStore } from '@state/useStatusStore';
import { useLoadAssignments } from '@hooks/useLoadAssignments';

export default function AssignmentsComponent() {
  const user = useUserStore(state => state.user);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { handleChangeSubtaskStatus } = useSubtaskStatus(setSelectedTicket);
  const status = useStatusStore(state => state.status);
  const { tickets, loading } = useLoadAssignments(
    user?.email || '',
    status ?? '',
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Mis asignaciones</Text>
        <Text style={styles.empty}>
          Por favor, inicia sesión para ver tus asignaciones.
        </Text>
      </View>
    );
  }

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
        user={user}
        myAssignments={true}
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
