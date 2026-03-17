// App.js
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importa tus pantallas
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import RegistroScreen from './screens/RegistroScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
// IMPORTAR NUEVA PANTALLA
import NativeFeaturesScreen from './screens/NativeFeaturesScreen';

const Stack = createNativeStackNavigator();

console.log("🚀 App.js - Iniciando aplicación");

function AppNavigator() {
  const { user, isLoading } = useAuth();
  
  console.log("📱 AppNavigator - isLoading:", isLoading, "user:", user ? "✅" : "❌");

  if (isLoading) {
    console.log("⏳ Mostrando pantalla de carga...");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Cargando aplicación...</Text>
      </View>
    );
  }

  console.log("🔄 Navegando a:", user ? "Dashboard" : "Home");
  
  return (
    <Stack.Navigator>
      {user ? (
        // ============================================
        // USUARIO AUTENTICADO
        // ============================================
        <>
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen} 
            options={{ 
              title: 'Dashboard',
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' }
            }}
          />
          <Stack.Screen 
            name="NativeFeatures" 
            component={NativeFeaturesScreen} 
            options={{ 
              title: 'Funcionalidades Nativas',
              headerStyle: { backgroundColor: '#9c27b0' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' }
            }}
          />
        </>
      ) : (
        // ============================================
        // USUARIO NO AUTENTICADO
        // ============================================
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ 
              title: 'Iniciar Sesión',
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' }
            }}
          />
          <Stack.Screen 
            name="Registro" 
            component={RegistroScreen} 
            options={{ 
              title: 'Registro de Usuario',
              headerStyle: { backgroundColor: '#28a745' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' }
            }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ 
              title: 'Recuperar Contraseña',
              headerStyle: { backgroundColor: '#ff9800' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' }
            }}
          />
          <Stack.Screen 
            name="NativeFeatures" 
            component={NativeFeaturesScreen} 
            options={{ 
              title: 'Funcionalidades Nativas',
              headerStyle: { backgroundColor: '#9c27b0' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' }
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  console.log("⚡ App - Renderizando componente principal");
  
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}