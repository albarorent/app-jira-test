import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useUserStore } from '@state/userStore';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

export default function LoginScreen() {
  const { width } = Dimensions.get('window');
  
  const { login } = useUserStore();
  const [email, setEmail] = useState('arcedaniel@gmail.com');
  const [password, setPassword] = useState('daniel123');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    const fakeApiLogin = new Promise<{ name: string; email: string; token: string }>((resolve) =>
      setTimeout(() => resolve({ name: 'Daniel Arce', email, token: 'mock-token-123' }), 1000)
    );

    const userData = await fakeApiLogin;
    login(userData);
  };

  return (
    <LinearGradient colors={['#691085ff', '#dcbcffff']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <Svg
        width={width}
        height={160}
        viewBox={`0 0 ${width} 160`}
        style={styles.waves}
      >
        <Path
          d={`M0 80 C ${width/4} 120, ${3*width/4} 40, ${width} 80 L ${width} 160 L 0 160 Z`}
          fill="white"
        />
      </Svg>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#FFF',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFF',
  },
  button: {
    backgroundColor: '#691085ff',
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  waves: {
    position: 'absolute',
    bottom: 0,
  },
});