const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;
const SECRET_KEY = "clave_secreta_ronny_2026";

// Base de datos simulada
let usuarios = [
  {
    id: 1,
    name: "Ronny Melo",
    email: "ronny@correo.com",
    password: "12345",
    role: "admin"
  },
  {
    id: 2,
    name: "Usuario Normal",
    email: "usuario@correo.com",
    password: "12345",
    role: "user"
  }
];

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.usuario = decoded;
    next();
  });
};

// ============================================
// ACTIVIDAD A: Endpoint de Login
// ============================================
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`🔐 Login intento: ${email}`);

  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      role: usuario.role 
    }, 
    SECRET_KEY, 
    { expiresIn: '1h' }
  );

  console.log(`✅ Login exitoso: ${email}`);
  res.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in: 3600
  });
});

// ============================================
// Endpoint de Registro (NUEVO)
// ============================================
app.post('/registro', (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(`📝 Intento de registro: ${email}`);

  // Verificar si el usuario ya existe
  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: usuarios.length + 1,
    name,
    email,
    password, // En producción, deberías encriptar la contraseña
    role: role || 'user'
  };

  usuarios.push(nuevoUsuario);
  console.log(`✅ Usuario registrado: ${email}`);

  // Generar token automáticamente después del registro
  const token = jwt.sign(
    { 
      id: nuevoUsuario.id, 
      email: nuevoUsuario.email, 
      role: nuevoUsuario.role 
    }, 
    SECRET_KEY, 
    { expiresIn: '1h' }
  );

  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    access_token: token,
    token_type: 'Bearer',
    user: {
      id: nuevoUsuario.id,
      name: nuevoUsuario.name,
      email: nuevoUsuario.email,
      role: nuevoUsuario.role
    }
  });
});

// ============================================
// Endpoint para solicitar recuperación de contraseña (NUEVO)
// ============================================
app.post('/recuperar-password', (req, res) => {
  const { email } = req.body;
  console.log(`🔐 Solicitud de recuperación: ${email}`);

  const usuario = usuarios.find(u => u.email === email);
  
  if (!usuario) {
    // Por seguridad, siempre decimos lo mismo aunque el email no exista
    return res.json({
      message: 'Si el email existe, recibirás instrucciones'
    });
  }

  // Generar token de recuperación (expira en 15 minutos)
  const resetToken = jwt.sign(
    { id: usuario.id, email: usuario.email, type: 'reset' },
    SECRET_KEY,
    { expiresIn: '15m' }
  );

  console.log(`📧 Token de recuperación generado para: ${email}`);
  
  res.json({
    message: 'Si el email existe, recibirás instrucciones',
    reset_token: resetToken, // Solo para pruebas
    reset_url: `http://localhost:3000/reset-password?token=${resetToken}`
  });
});

// ============================================
// Endpoint para resetear password (NUEVO)
// ============================================
app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    if (decoded.type !== 'reset') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const usuario = usuarios.find(u => u.id === decoded.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar contraseña
    usuario.password = newPassword;
    console.log(`✅ Password actualizado para: ${usuario.email}`);

    res.json({ message: 'Password actualizado exitosamente' });
    
  } catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});

// ============================================
// Endpoint protegido: Perfil
// ============================================
app.get('/perfil', verificarToken, (req, res) => {
  console.log(`👤 Perfil solicitado por: ${req.usuario.email}`);
  
  const usuario = usuarios.find(u => u.id === req.usuario.id);
  
  res.json({
    id: usuario.id,
    email: usuario.email,
    name: usuario.name,
    role: usuario.role,
    message: 'Acceso concedido a ruta protegida'
  });
});

// ============================================
// Endpoint protegido: Usuario (para Dashboard)
// ============================================
app.get('/usuario', verificarToken, (req, res) => {
  console.log(`📊 Datos solicitados por: ${req.usuario.email}`);
  
  const usuario = usuarios.find(u => u.id === req.usuario.id);
  
  res.json({
    email: usuario.email,
    name: usuario.name,
    role: usuario.role
  });
});

// ============================================
// Endpoint público de prueba
// ============================================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// ============================================
// Iniciar servidor
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor JWT listo en: http://localhost:${PORT}`);
  console.log(`📝 Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/login`);
  console.log(`   POST http://localhost:${PORT}/registro`);
  console.log(`   POST http://localhost:${PORT}/recuperar-password`);
  console.log(`   POST http://localhost:${PORT}/reset-password`);
  console.log(`   GET  http://localhost:${PORT}/perfil`);
  console.log(`   GET  http://localhost:${PORT}/usuario`);
  console.log(`   GET  http://localhost:${PORT}/health`);
});