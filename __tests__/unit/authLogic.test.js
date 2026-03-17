// __tests__/unit/authLogic.test.js
import { 
  validarEmail, 
  validarPassword, 
  formatearUsuario,
  validarCredenciales 
} from '../../utils/authUtils';

describe('🧪 Pruebas Unitarias - Lógica de Autenticación', () => {
  
  // ============================================
  // TEST 1: Validación de Email
  // ============================================
  describe('validarEmail', () => {
    test('debe aceptar emails correctos', () => {
      expect(validarEmail('usuario@correo.com')).toBe(true);
      expect(validarEmail('nombre.apellido@empresa.co')).toBe(true);
      expect(validarEmail('test123@dominio.org')).toBe(true);
      expect(validarEmail('user+filter@gmail.com')).toBe(true);
    });

    test('debe rechazar emails incorrectos', () => {
      expect(validarEmail('usuario')).toBe(false);
      expect(validarEmail('usuario@')).toBe(false);
      expect(validarEmail('usuario@correo')).toBe(false);
      expect(validarEmail('@correo.com')).toBe(false);
      expect(validarEmail('')).toBe(false);
      expect(validarEmail(null)).toBe(false);
      expect(validarEmail(undefined)).toBe(false);
    });
  });

  // ============================================
  // TEST 2: Validación de Contraseña
  // ============================================
  describe('validarPassword', () => {
    test('debe requerir mínimo 6 caracteres', () => {
      expect(validarPassword('12345')).toBe(false);
      expect(validarPassword('123456')).toBe(true);
      expect(validarPassword('abcdef')).toBe(true);
      expect(validarPassword('')).toBe(false);
      expect(validarPassword(null)).toBe(false);
    });
  });

  // ============================================
  // TEST 3: Formateo de datos de usuario
  // ============================================
  describe('formatearUsuario', () => {
    test('debe formatear usuario completo correctamente', () => {
      const usuarioRaw = {
        name: '  Ronny Melo  ',
        email: 'RONNY@CORREO.COM',
        role: 'admin'
      };

      const formateado = formatearUsuario(usuarioRaw);

      expect(formateado).toEqual({
        nombreCompleto: 'Ronny Melo',
        email: 'ronny@correo.com',
        rol: 'Administrador',
        iniciales: 'RM'
      });
    });

    test('debe formatear usuario sin nombre', () => {
      const usuarioRaw = {
        email: 'test@correo.com',
        role: 'user'
      };

      const formateado = formatearUsuario(usuarioRaw);

      expect(formateado).toEqual({
        nombreCompleto: 'Usuario',
        email: 'test@correo.com',
        rol: 'Usuario',
        iniciales: 'U'
      });
    });

    test('debe manejar usuario sin email', () => {
      const usuarioRaw = {
        name: 'Juan Pérez',
        role: 'user'
      };

      const formateado = formatearUsuario(usuarioRaw);

      expect(formateado).toEqual({
        nombreCompleto: 'Juan Pérez',
        email: 'sin-email@dominio.com',
        rol: 'Usuario',
        iniciales: 'JP'
      });
    });

    test('debe lanzar error con datos inválidos', () => {
      expect(() => formatearUsuario(null)).toThrow('Datos de usuario inválidos');
      expect(() => formatearUsuario(undefined)).toThrow('Datos de usuario inválidos');
      expect(() => formatearUsuario('string')).toThrow('Datos de usuario inválidos');
    });
  });

  // ============================================
  // TEST 4: Validación de credenciales completas
  // ============================================
  describe('validarCredenciales', () => {
    test('debe aceptar credenciales válidas', () => {
      const resultado = validarCredenciales('test@correo.com', '123456');
      expect(resultado.valido).toBe(true);
      expect(resultado.errores).toEqual([]);
    });

    test('debe rechazar email inválido', () => {
      const resultado = validarCredenciales('invalido', '123456');
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('Email inválido');
    });

    test('debe rechazar contraseña corta', () => {
      const resultado = validarCredenciales('test@correo.com', '123');
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toContain('La contraseña debe tener al menos 6 caracteres');
    });

    test('debe acumular múltiples errores', () => {
      const resultado = validarCredenciales('invalido', '123');
      expect(resultado.valido).toBe(false);
      expect(resultado.errores).toHaveLength(2);
      expect(resultado.errores).toEqual([
        'Email inválido',
        'La contraseña debe tener al menos 6 caracteres'
      ]);
    });
  });
});