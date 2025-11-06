import { View, Text, Modal, Button, StyleSheet } from 'react-native'
import React, { memo } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import { getStatusColor, getStatusText, SUBTASK_STATUSES } from '@utils/helpers';
import { Picker } from '@react-native-picker/picker';
import { Ticket } from '@services/ticketMockService';

interface DetailTicketProps {
  selectedTicket: Ticket | null;
  setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  handleChangeSubtaskStatus: (subtaskId: string, newStatus: 'open' | 'in_progress' | 'closed') => void;
}

const DetailTicket = memo(({ selectedTicket, setSelectedTicket, handleChangeSubtaskStatus }: DetailTicketProps) => {
  return (
     <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
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
                      <Text
                        style={[
                          styles.subtaskStatus,
                          { color: getStatusColor(sub.status) },
                        ]}
                      >
                        {getStatusText(sub.status)}
                      </Text>
                      <Picker
                        selectedValue={sub.status}
                        style={{ height: 30, width: 120 }}
                        onValueChange={itemValue =>
                          handleChangeSubtaskStatus(
                            sub.id,
                            itemValue as 'open' | 'in_progress' | 'closed',
                          )
                        }
                      >
                        {SUBTASK_STATUSES.map(opt => (
                          <Picker.Item
                            key={opt.value}
                            label={opt.label}
                            value={opt.value}
                          />
                        ))}
                      </Picker>
                    </View>
                  ))}
                </>
              ) : null}
              <Button title="Cerrar" onPress={() => setSelectedTicket(null)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
  )
});

const styles = StyleSheet.create({
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
  subtaskStatus: { marginLeft: 8, fontSize: 11 },
});


export default DetailTicket