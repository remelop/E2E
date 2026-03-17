// screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  
  console.log("🏠 HomeScreen - Renderizando");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home Screen</Text>
      <Text style={styles.subtitle}>Bienvenido a la app</Text>
      
      {/* Botón original */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#007bff' }]}
        onPress={() => {
          console.log("👆 Navegando a Login");
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.buttonText}>Ir a Login</Text>
      </TouchableOpacity>

      {/* Nuevo botón para Registro */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#28a745', marginTop: 10 }]}
        onPress={() => {
          console.log("👆 Navegando a Registro");
          navigation.navigate('Registro');
        }}
      >
        <Text style={styles.buttonText}>📝 Ir a Registro</Text>
      </TouchableOpacity>

      {/* Nuevo botón para Funcionalidades Nativas */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#9c27b0', marginTop: 10 }]}
        onPress={() => {
          console.log("👆 Navegando a Funcionalidades Nativas");
          navigation.navigate('NativeFeatures');
        }}
      >
        <Text style={styles.buttonText}>📱 Funcionalidades Nativas</Text>
      </TouchableOpacity>

      {/* Nuevo botón para Recuperar Contraseña */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#ff9800', marginTop: 10 }]}
        onPress={() => {
          console.log("👆 Navegando a Recuperar Contraseña");
          navigation.navigate('ForgotPassword');
        }}
      >
        <Text style={styles.buttonText}>🔐 Recuperar Contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});