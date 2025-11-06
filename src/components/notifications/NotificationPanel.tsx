import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useCommentStore } from '@state/useCommets';

const NotificationsPanel = ({
  user,
  onSelectTicket,
}: {
  user: { email: string };
  onSelectTicket?: (ticketId: string) => void;
}) => {
  const getNotifications = useCommentStore(state => state.getNotifications);
  const markNotificationSeen = useCommentStore(
    state => state.markNotificationSeen,
  );
  const notifications = getNotifications(user.email).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>No tienes notificaciones 🎉</Text>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingVertical: 6, paddingBottom: 20 }}
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.item]}
              onPress={() => {
                markNotificationSeen(item.id);
                onSelectTicket?.(item.ticketId);
              }}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.iconBell}>🔔</Text>
                <View style={styles.stateBadgeContainer}>
                  <Text
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: item.seen ? '#dfe3e6' : '#ffd700',
                        color: item.seen ? '#666' : '#774d93',
                      },
                    ]}
                  >
                    {item.seen ? 'Leída' : 'Nueva'}
                  </Text>
                </View>
              </View>
              <Text style={styles.message} numberOfLines={3}>
                {item.message}
              </Text>
              <Text style={styles.itemTicketId}>
                Ticket:{' '}
                <Text style={{ fontWeight: 'bold', color: '#a984dd' }}>
                  {item.ticketId}
                </Text>
              </Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 12,
    color: '#774d93',
    letterSpacing: 0.5,
  },
  empty: {
    color: '#aaa',
    fontStyle: 'italic',
    marginVertical: 30,
    alignSelf: 'center',
  },
  item: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    elevation: 2,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  item_unread: {
    backgroundColor: '#f9f5ff',
    borderLeftColor: '#774d93',
    elevation: 5,
    shadowOpacity: 0.25,
  },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  iconBell: { marginRight: 8, fontSize: 18, color: '#774d93' },
  stateBadgeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  message: { marginVertical: 4, color: '#41355a', fontSize: 15 },
  itemTicketId: { fontSize: 12, color: '#888', marginTop: 2 },
  date: { fontSize: 11, color: '#b7b0ce', marginTop: 3, alignSelf: 'flex-end' },
});

export default NotificationsPanel;
