import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useUserStore } from '@state/userStore';
import ColorPicker from '@components/colorPicker/colorPicker';

export default function SettingsComponent() {
  const user = useUserStore((state) => state.user);
  const setUserColor = useUserStore((state) => state.setUserColor);
  const logout = useUserStore((state) => state.logout);

  const [selectedColor, setSelectedColor] = useState(user?.color || '#33A1FF');
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    if (user?.color && user.color !== selectedColor) {
      setSelectedColor(user.color);
    }
  }, [user?.color]);

  const handleColorChange = useCallback(
    (color: string) => {
      if (color === selectedColor) return;
      setSelectedColor(color);
      if (user) setUserColor(color);
    },
    [selectedColor, user]
  );

  const handleBiometricToggle = (value: boolean) => {
    setBiometricEnabled(value);
    Alert.alert(
      'Huella digital',
      value ? 'Huella digital activada correctamente' : 'Huella digital desactivada'
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Acerca de la aplicación',
      'Versión 1.0.0\nDesarrollado por el equipo de soporte técnico.'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionTop}>
        <Text style={styles.title}>Configuraciones de Usuario</Text>
        <Text style={styles.subtitle}>Hola, {user?.name}</Text>

        <View style={styles.preferenceBox}>
          <Text style={styles.preferenceTitle}>Color de usuario</Text>
          <ColorPicker selectedColor={selectedColor} onSelect={handleColorChange} />
        </View>
      </View>

      <View style={styles.sectionBottom}>
        <View style={styles.utilityRow}>
          <Text style={styles.utilityText}>Activar Huella Digital</Text>
          <Switch value={biometricEnabled} onValueChange={handleBiometricToggle} />
        </View>

        <TouchableOpacity style={styles.utilityRow} onPress={handleAbout}>
          <Text style={styles.utilityText}>Acerca de</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.utilityRow, { marginTop: 12 }]} onPress={logout}>
          <Text style={[styles.utilityText, { color: '#D32F2F', fontWeight: '600' }]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  sectionTop: {
    flex: 1,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 16,
  },
  sectionBottom: {
    paddingVertical: 20,
  },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8, color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  preferenceBox: {
    marginTop: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  utilityText: {
    fontSize: 16,
    color: '#333',
  },
});
