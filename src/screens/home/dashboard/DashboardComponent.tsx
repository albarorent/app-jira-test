import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';
import { useUserStore } from '@state/userStore';
import TicketList from '@components/ticketList/ticketList';
import { Ticket } from '@services/ticketMockService';

export default function DashboardComponent() {
  const user = useUserStore((state) => state.user);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Hola, {user?.name}</Text>
        <Text style={styles.subtitle}>Asignaciones del equipo</Text>
      </View>

      <TicketList onSelectTicket={(ticket) => setSelectedTicket(ticket)} />

      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedTicket?.title}</Text>
            <Text>Asignado a: {selectedTicket?.assignedTo}</Text>
            <Text>Estado: {selectedTicket?.status}</Text>
            <Text>Descripción: {selectedTicket?.description}</Text>
            <Text>Fecha: {selectedTicket?.date}</Text>

            <Button title="Cerrar" onPress={() => setSelectedTicket(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
});
