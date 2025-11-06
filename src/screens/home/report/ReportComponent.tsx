import { useLoadTicket } from '@hooks/useLoadTicket';
import { getStatusColor, groupTicketsByUserAndStatus } from '@utils/helpers';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const ReportComponent = () => {
  const { tickets } = useLoadTicket();

  const developersReport = groupTicketsByUserAndStatus(tickets);

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 19, marginBottom: 12 }}>
        Resumen de tickets por usuario y estado
      </Text>
      {Object.entries(developersReport).map(([user, states]) => (
        <View key={user} style={styles.userSection}>
          <Text style={styles.userName}>{user}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {Object.entries(states).map(([estado, cantidad]) => (
              <View
                key={estado}
                style={[
                  styles.stateBox,
                  { backgroundColor: getStatusColor(estado) },
                ]}
              >
                <Text
                  style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}
                >
                  {estado.toUpperCase()}
                </Text>
                <Text
                  style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}
                >
                  {cantidad}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  userSection: {
    marginBottom: 18,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f2f2f8',
    elevation: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 7,
    fontSize: 15,
  },
  stateBox: {
    padding: 8,
    borderRadius: 6,
    minWidth: 76,
    alignItems: 'center',
    marginRight: 4,
  },
});

export default ReportComponent;
