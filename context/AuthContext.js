// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';
import { Platform } from 'react-native';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Almacenamiento según plataforma
const storage = Platform.select({
  web: {
    getItem: async (key) => localStorage.getItem(key),
    setItem: async (key, value) => localStorage.setItem(key, value),
    removeItem: async (key) => localStorage.removeItem(key),
  },
  default: SecureStore
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar token al iniciar
  useEffect(() => {
    verificarTokenGuardado();
  }, []);

  const verificarTokenGuardado = async () => {
    try {
      console.log('🔍 Verificando token guardado...');
      const token = await storage.getItem('userToken');
      
      if (token) {
        console.log('✅ Token encontrado, validando...');
        const valido = await validarToken(token);
        
        if (valido) {
          console.log('✅ Token válido, usuario autenticado');
          const userData = await obtenerDatosUsuario(token);
          setUser({ token, ...userData });
        } else {
          console.log('❌ Token inválido, eliminando...');
          await storage.removeItem('userToken');
        }
      } else {
        console.log('ℹ️ No hay token guardado');
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validarToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/usuario`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const obtenerDatosUsuario = async (token) => {
    try {
      const response = await fetch(`${API_URL}/usuario`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      return null;
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📤 Enviando login...');
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📥 Respuesta:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      // Guardar token
      await storage.setItem('userToken', data.access_token);
      
      // Obtener datos del usuario
      const userData = await obtenerDatosUsuario(data.access_token);
      
      setUser({ token: data.access_token, ...userData });
      
      return { success: true };

    } catch (error) {
      console.error('❌ Error login:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('userToken');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error logout:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};