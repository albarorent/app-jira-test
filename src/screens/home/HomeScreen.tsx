import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashboardComponent from '@screens/home/dashboard/DashboardComponent';
import AssignmentsComponent from '@screens/home/assignment/AssignmentsComponent';
import SettingsComponent from '@screens/home/setting/SettingsComponent';
import ReportComponent from '@screens/home/report/ReportComponent';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Dashboard() {
  // const user = useUserStore(state => state.user);
  return <DashboardComponent />;
}

function Assignments() {
  // const user = useUserStore(state => state.user);
  return <AssignmentsComponent />;
}

function Settings() {
  // const user = useUserStore(state => state.user);
  return <SettingsComponent />;
}

function Report() {
  // const user = useUserStore(state => state.user);
  return <ReportComponent />;
}

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          const icons: Record<string, string> = {
            homeTab: 'home-outline',
            mytaskTab: 'person-outline',
            settingsTab: 'settings-outline',
            reportTab: 'bar-chart-outline',
          };
          const tabId = (route.params as { id?: string } | undefined)?.id;
          const iconName = icons[tabId ?? 'homeTab'];

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#691085ff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Inicio"
        initialParams={{ id: 'homeTab' }}
        component={Dashboard}
      />
      <Tab.Screen
        name="MyTasks"
        initialParams={{ id: 'mytaskTab' }}
        component={Assignments}
      />
      <Tab.Screen
        name="Report"
        initialParams={{ id: 'reportTab' }}
        component={Report}
      />
      <Tab.Screen
        name="Settings"
        initialParams={{ id: 'settingsTab' }}
        component={Settings}
      />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Principal"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name="Perfil" component={Assignments} />
      <Drawer.Screen name="Configuración" component={Settings} />
    </Drawer.Navigator>
  );
}

export default function HomeScreen() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}

