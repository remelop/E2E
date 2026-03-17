// __tests__/integration/LoginScreen.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../context/AuthContext';
import LoginScreen from '../../screens/LoginScreen';
import { Alert } from 'react-native';

// Mock de Alert
jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

// Mock de fetch
global.fetch = jest.fn();

// Mock de navegación
const mockNavigate = jest.fn();
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: mockReset
  })
}));

// Variable para controlar el mock de useAuth
let mockLogin = jest.fn();

// Mock del AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    login: mockLogin,
    logout: jest.fn(),
    isAuthenticated: false
  }),
  AuthProvider: ({ children }) => children
}));

describe('🧪 Pruebas de Integración - LoginScreen', () => {
  
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    mockReset.mockClear();
    Alert.alert.mockClear();
    mockLogin.mockClear();
  });

  const renderLoginScreen = () => {
    return render(
      <AuthProvider>
        <NavigationContainer>
          <LoginScreen />
        </NavigationContainer>
      </AuthProvider>
    );
  };

  // ============================================
  // TEST 1: Renderizado correcto
  // ============================================
  test('debe renderizar todos los elementos del login', () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByText('Iniciar Sesión')).toBeTruthy();
  });

  // ============================================
  // TEST 2: Validación de campos vacíos
  // ============================================
  test('debe mostrar alerta si los campos están vacíos', async () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();
    
    // Limpiar los campos
    fireEvent.changeText(getByPlaceholderText('Email'), '');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), '');
    
    const loginButton = getByText('Iniciar Sesión');
    fireEvent.press(loginButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Completa todos los campos');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // ============================================
  // TEST 3: Login exitoso
  // ============================================
  test('debe navegar al dashboard en login exitoso', async () => {
    // Configurar mock para login exitoso
    mockLogin.mockResolvedValueOnce({ success: true });

    const { getByPlaceholderText, getByText } = renderLoginScreen();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@correo.com');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), '123456');
    fireEvent.press(getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@correo.com', '123456');
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Dashboard' }]
      });
    });
  });

  // ============================================
  // TEST 4: Manejo de error del servidor
  // ============================================
  test('debe mostrar alerta cuando el login falla', async () => {
    // Configurar mock para login fallido
    mockLogin.mockResolvedValueOnce({ success: false, error: 'Credenciales incorrectas' });

    const { getByPlaceholderText, getByText } = renderLoginScreen();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@correo.com');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'wrongpass');
    fireEvent.press(getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@correo.com', 'wrongpass');
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Credenciales incorrectas');
      expect(mockReset).not.toHaveBeenCalled();
    });
  });
});