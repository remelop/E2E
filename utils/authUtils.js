// utils/authUtils.js

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export const validarEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * Valida contraseña (mínimo 6 caracteres)
 * @param {string} password - Contraseña a validar
 * @returns {boolean} - true si es válida
 */
export const validarPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

/**
 * Formatea datos de usuario para mostrar
 * @param {Object} usuario - Datos del usuario
 * @returns {Object} - Usuario formateado
 */
export const formatearUsuario = (usuario) => {
  if (!usuario || typeof usuario !== 'object') {
    throw new Error('Datos de usuario inválidos');
  }

  const nombre = usuario.name?.trim() || '';
  const email = usuario.email?.toLowerCase().trim() || '';
  const rol = usuario.role === 'admin' ? 'Administrador' : 'Usuario';

  // Obtener iniciales (máximo 2 caracteres)
  const iniciales = nombre
    .split(' ')
    .map(p => p[0])
    .filter(c => c)
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U';

  return {
    nombreCompleto: nombre || 'Usuario',
    email: email || 'sin-email@dominio.com',
    rol,
    iniciales
  };
};

/**
 * Valida credenciales completas
 * @param {string} email - Email
 * @param {string} password - Contraseña
 * @returns {Object} - Resultado de validación
 */
export const validarCredenciales = (email, password) => {
  const errores = [];
  
  if (!validarEmail(email)) {
    errores.push('Email inválido');
  }
  
  if (!validarPassword(password)) {
    errores.push('La contraseña debe tener al menos 6 caracteres');
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
};