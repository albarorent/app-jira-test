import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserStore } from '@state/userStore';
import TicketList from '@components/ticketList/ticketList';
import { getTicketId, Ticket } from '@services/ticketMockService';
import DetailTicket from '@components/detailTicket/detailTicket';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NotificationsPanel from '@components/notifications/NotificationPanel';
import { useSubtaskStatus } from '@hooks/useChangeSubtaskStatus';

export default function DashboardComponent() {
  const user = useUserStore(state => state.user);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const { handleChangeSubtaskStatus } = useSubtaskStatus(setSelectedTicket);

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.title}>Hola, {user?.name}</Text>
          <Text style={styles.subtitle}>Asignaciones del equipo</Text>
        </View>
        <TouchableOpacity onPress={() => setNotificationsVisible(true)}>
          <Ionicons
            name={'notifications-outline'}
            size={28}
            color={'#691085ff'}
          />
        </TouchableOpacity>
      </View>

      <TicketList onSelectTicket={ticket => setSelectedTicket(ticket)} />

      <DetailTicket
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        user={user!}
        handleChangeSubtaskStatus={handleChangeSubtaskStatus}
      />

      {/* Modal de notificaciones */}
      <Modal
        visible={notificationsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <NotificationsPanel
              user={user!}
              onSelectTicket={ticketId => {
                getTicketId(ticketId).then(ticket => {
                  if (ticket) {
                    setSelectedTicket(ticket as unknown as Ticket);
                  }
                  setNotificationsVisible(false);
                });
              }}
            />
            <TouchableOpacity
              style={{ marginTop: 10, alignSelf: 'center' }}
              onPress={() => setNotificationsVisible(false)}
            >
              <Text style={{ color: '#691085ff', fontWeight: 'bold' }}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
    maxHeight: '80%',
    height: '50%',
    minWidth: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
});
