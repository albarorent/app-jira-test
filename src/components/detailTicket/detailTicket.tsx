import { View, Text, Modal, StyleSheet, Button } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import {
  getStatusColor,
  getStatusText,
  SUBTASK_STATUSES,
} from '@utils/helpers';
import {
  Ticket,
  TicketStatus,
  updateTicketStatus,
} from '@services/ticketMockService';
import { useCommentStore } from '@state/useCommets';
import { getUserByEmail } from '@services/userService';
import { useStatusStore } from '@state/useStatusStore';

interface DetailTicketProps {
  selectedTicket: Ticket | null;
  setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  handleChangeSubtaskStatus?: (
    subtaskId: string,
    newStatus: TicketStatus,
  ) => void;
  user: { email: string };
  myAssignments?: boolean;
}

const MAX_COMMENT_HEIGHT = 300;

const TICKET_STATUSES = [
  { value: 'done', label: 'Finalizado' },
  { value: 'cancel', label: 'Cancelado' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'open', label: 'Abierto' },
] as const;

const DetailTicket = memo(
  ({
    selectedTicket,
    setSelectedTicket,
    handleChangeSubtaskStatus,
    user,
    myAssignments
  }: DetailTicketProps) => {
    const [newComment, setNewComment] = useState('');
    const [roleUser, setRoleUser] = useState<string>('');
    const getComments = useCommentStore(state => state.getComments);
    const addComment = useCommentStore(state => state.addComment);
    const setStatus = useStatusStore(state => state.setStatus);

    useEffect(() => {
      getUserByEmail(user.email).then(userData => {
        setRoleUser(userData?.role || '');
      });
    }, [user.email]);

    if (!selectedTicket) return null;

    const comments = getComments(selectedTicket.id);

    const handleSendComment = () => {
      if (!newComment.trim()) return;
      addComment(selectedTicket.id, user.email, newComment, true);
      setNewComment('');
    };

    const handleTicketStatusChange = (newStatus: Ticket['status']) => {
      if (selectedTicket.status === newStatus) return;
      updateTicketStatus(selectedTicket.id, newStatus).then(updatedTicket => {
        if (updatedTicket) {
          setSelectedTicket(updatedTicket);
          setStatus(newStatus);
        }
      });
    };
    
    return (
      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <View
              style={{
                backgroundColor: getStatusColor(selectedTicket.status),
                height: 5,
              }}
            />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.modalTitle}>{selectedTicket.title}</Text>
              <Text style={styles.modalLabel}>
                Asignado a:{' '}
                <Text style={styles.modalValue}>
                  {selectedTicket.assignedTo}
                </Text>
              </Text>

              {/* Picker para el estado del ticket */}
              {roleUser === 'lead' ? (
                <View style={{ marginVertical: 10 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    Estado general del ticket:
                  </Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      { borderColor: getStatusColor(selectedTicket.status) },
                    ]}
                  >
                    <Picker
                      enabled={roleUser === 'lead'}
                      selectedValue={selectedTicket.status}
                      onValueChange={itemValue =>
                        handleTicketStatusChange(itemValue as Ticket['status'])
                      }
                    >
                      {TICKET_STATUSES.map(status => (
                        <Picker.Item
                          key={status.value}
                          label={status.label}
                          value={status.value}
                          color={getStatusColor(status.value)}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              ) : (
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
                      {
                        backgroundColor: getStatusColor(selectedTicket.status),
                      },
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {getStatusText(selectedTicket.status)}
                  </Text>
                </View>
              )}

              <Text style={styles.modalLabel}>Descripción:</Text>
              <Text style={styles.modalValue}>
                {selectedTicket.description}
              </Text>

              <Text style={styles.modalLabel}>Fecha:</Text>
              <Text style={styles.modalValue}>{selectedTicket.date}</Text>

              {selectedTicket.subtasks?.length ? (
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
                      {(handleChangeSubtaskStatus && roleUser === 'lead' || myAssignments && handleChangeSubtaskStatus) ? (
                        <Picker
                          selectedValue={sub.status}
                          style={{ height: 30, width: 150 }}
                          onValueChange={itemValue =>
                            handleChangeSubtaskStatus(sub.id, itemValue)
                          }
                        >
                          {SUBTASK_STATUSES.map(status => (
                            <Picker.Item
                              key={status.value}
                              label={status.label}
                              value={status.value}
                            />
                          ))}
                        </Picker>
                      ) : null}
                    </View>
                  ))}
                </>
              ) : null}

              <Text style={{ fontWeight: 'bold', marginTop: 20 }}>
                Comentarios:
              </Text>
              <View style={{ maxHeight: MAX_COMMENT_HEIGHT }}>
                <ScrollView>
                  {comments.length === 0 ? (
                    <Text style={{ color: '#aaa', fontStyle: 'italic' }}>
                      Sin comentarios
                    </Text>
                  ) : (
                    comments.map(c => (
                      <View
                        key={c.id}
                        style={{
                          marginVertical: 6,
                          backgroundColor: '#f2f2f2',
                          borderRadius: 7,
                          padding: 7,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              c.author !== user.email
                                ? '#691085ff'
                                : '#a2c429ff',
                            fontWeight: 'bold',
                          }}
                        >
                          {c.author}
                        </Text>
                        <Text>{c.text}</Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#aaa',
                            alignSelf: 'flex-end',
                          }}
                        >
                          {new Date(c.date).toLocaleString()}
                        </Text>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Agrega un comentario (usa @ para mencionar)"
                style={{
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 6,
                  marginTop: 8,
                  marginBottom: 8,
                  minHeight: 40,
                  padding: 6,
                }}
                multiline
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Button title="Enviar" onPress={handleSendComment} />
                <Button
                  title="Cerrar"
                  onPress={() => setSelectedTicket(null)}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  },
);

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
  pickerContainer: {
    borderWidth: 1.5,
    borderRadius: 6,
    backgroundColor: '#fafafa',
    marginVertical: 2,
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

export default DetailTicket;
