import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Button,
} from 'react-native';
import { assignmentsList, Ticket } from '@services/ticketMockService';
import { useUserStore } from '@state/userStore';
import { getUserByEmail, User } from '@services/userService';
import { ScrollView } from 'react-native-gesture-handler';
import { getStatusColor, getStatusText } from '@utils/delay';

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
              <Text style={styles.status}>Estado: {item.status}</Text>
              <Text style={styles.date}>Asignado el {item.date}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            {/* Estado visual (borde lateral o etiqueta color) */}
            <View
              style={[
                { backgroundColor: getStatusColor(selectedTicket?.status) },
              ]}
            />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.modalTitle}>{selectedTicket?.title}</Text>
              <Text style={styles.modalLabel}>
                Asignado a:{' '}
                <Text style={styles.modalValue}>
                  {selectedTicket?.assignedTo}
                </Text>
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 6,
                }}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(selectedTicket?.status) },
                  ]}
                />
                <Text style={styles.statusText}>
                  {getStatusText(selectedTicket?.status)}
                </Text>
              </View>

              <Text style={styles.modalLabel}>Descripción:</Text>
              <Text style={styles.modalValue}>
                {selectedTicket?.description}
              </Text>

              <Text style={styles.modalLabel}>Fecha:</Text>
              <Text style={styles.modalValue}>{selectedTicket?.date}</Text>

              {/* Subtareas */}
              {selectedTicket?.subtasks?.length ? (
                <>
                  <Text style={[styles.modalLabel, { marginTop: 12 }]}>
                    Subtareas:
                  </Text>
                  {selectedTicket.subtasks.map(sub => (
                    <View key={sub.id} style={styles.subtaskItem}>
                      <View
                        style={[
                          styles.subStatusDot,
                          { backgroundColor: getStatusColor(sub.status) },
                        ]}
                      />
                      <Text style={styles.subtaskTitle}>{sub.title}</Text>
                      <Text style={styles.subtaskStatus}>
                        {getStatusText(sub.status)}
                      </Text>
                    </View>
                  ))}
                </>
              ) : null}

              {/* Aquí podrías agregar comentarios, botón para agregar comentarios o cambiar estado */}

              <Button title="Cerrar" onPress={() => setSelectedTicket(null)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 21, fontWeight: 'bold', marginBottom: 6 },
  modalLabel: { fontWeight: 'bold', marginTop: 8 },
  modalValue: { marginBottom: 4, color: '#444' },
 
  statusText: { marginLeft: 8, fontWeight: 'bold' },
  statusDot: { width: 13, height: 13, borderRadius: 7, marginRight: 4 },
  subStatusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 2,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 8,
  },
  subtaskTitle: { flex: 1, color: '#222' },
  subtaskStatus: { marginLeft: 8, fontSize: 11, color: '#999' },
});
