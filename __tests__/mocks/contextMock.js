// __tests__/mocks/contextMock.js

/**
 * Mock del contexto de autenticación para pruebas
 */
export const mockAuthContext = {
  // Estado del usuario
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  // Funciones mockeadas
  login: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue({ success: true }),
  
  // Usuario mockeado (para pruebas con usuario autenticado)
  mockUser: {
    email: 'test@correo.com',
    name: 'Usuario Test',
    role: 'user',
    token: 'fake-token-123'
  },
  
  // Usuario admin mockeado
  mockAdmin: {
    email: 'admin@correo.com',
    name: 'Admin Test',
    role: 'admin',
    token: 'fake-token-admin-123'
  }
};

/**
 * Función para resetear todos los mocks entre pruebas
 */
export const resetMocks = () => {
  mockAuthContext.login.mockClear();
  mockAuthContext.logout.mockClear();
};

/**
 * Hook personalizado mockeado para usar en pruebas
 */
export const useAuth = jest.fn().mockReturnValue(mockAuthContext);