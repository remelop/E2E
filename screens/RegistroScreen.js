// screens/RegistroScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function RegistroScreen() {
  const navigation = useNavigation();
  const { login } = useAuth(); // Para login automático después del registro
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const handleRegister = async () => {
    // Validaciones
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      Alert.alert(
        '✅ Registro exitoso',
        'Tu cuenta ha sido creada',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Login automático con el token recibido
              await login(form.email, form.password);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }]
              });
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📝 Registro</Text>
      <Text style={styles.subtitle}>Crea tu cuenta</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={form.name}
          onChangeText={(text) => setForm({...form, name: text})}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => setForm({...form, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={form.password}
          onChangeText={(text) => setForm({...form, password: text})}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChangeText={(text) => setForm({...form, confirmPassword: text})}
          secureTextEntry
        />

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              form.role === 'user' && styles.roleButtonActive
            ]}
            onPress={() => setForm({...form, role: 'user'})}
          >
            <Text style={[
              styles.roleText,
              form.role === 'user' && styles.roleTextActive
            ]}>👤 Usuario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              form.role === 'admin' && styles.roleButtonActive
            ]}
            onPress={() => setForm({...form, role: 'admin'})}
          >
            <Text style={[
              styles.roleText,
              form.role === 'admin' && styles.roleTextActive
            ]}>👑 Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>REGISTRARSE</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>← Volver al Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    gap: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 10,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  roleText: {
    fontSize: 16,
    color: '#495057',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});