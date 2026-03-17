// e2e/starter.test.js
const { reloadApp } = require('detox-expo-helpers');

describe('🎬 Pruebas E2E - Flujo Completo de la App', () => {
  
  beforeEach(async () => {
    // Recargar la app antes de cada prueba
    await reloadApp();
  });

  // ============================================
  // TEST 1: Verificar pantalla de Home
  // ============================================
  it('debe mostrar la pantalla de Home correctamente', async () => {
    await expect(element(by.text('🏠 Home Screen'))).toBeVisible();
    await expect(element(by.text('Ir a Login'))).toBeVisible();
    await expect(element(by.text('📝 Ir a Registro'))).toBeVisible();
    await expect(element(by.text('📱 Funcionalidades Nativas'))).toBeVisible();
    await expect(element(by.text('🔐 Recuperar Contraseña'))).toBeVisible();
  });

  // ============================================
  // TEST 2: Navegación a Login
  // ============================================
  it('debe navegar a la pantalla de Login', async () => {
    await element(by.text('Ir a Login')).tap();
    
    await expect(element(by.text('🔐 Login JWT'))).toBeVisible();
    await expect(element(by.placeholder('Email'))).toBeVisible();
    await expect(element(by.placeholder('Contraseña'))).toBeVisible();
    await expect(element(by.text('Iniciar Sesión'))).toBeVisible();
  });

  // ============================================
  // TEST 3: Validación de campos vacíos
  // ============================================
  it('debe mostrar alerta si los campos están vacíos', async () => {
    await element(by.text('Ir a Login')).tap();
    
    // Limpiar campos (por defecto tienen valores)
    await element(by.placeholder('Email')).clearText();
    await element(by.placeholder('Contraseña')).clearText();
    
    await element(by.text('Iniciar Sesión')).tap();
    
    // Verificar que aparece el alert (esto puede variar según plataforma)
    if (device.getPlatform() === 'ios') {
      await expect(element(by.label('Error'))).toBeVisible();
    } else {
      // En Android, verificamos que seguimos en Login (no navegamos)
      await expect(element(by.text('🔐 Login JWT'))).toBeVisible();
    }
  });

  // ============================================
  // TEST 4: Login exitoso con credenciales válidas
  // ============================================
  it('debe hacer login exitoso y navegar al Dashboard', async () => {
    await element(by.text('Ir a Login')).tap();
    
    // Asegurar campos limpios antes de escribir
    await element(by.placeholder('Email')).clearText();
    await element(by.placeholder('Contraseña')).clearText();
    
    // Ingresar credenciales válidas
    await element(by.placeholder('Email')).typeText('ronny@correo.com');
    await element(by.placeholder('Contraseña')).typeText('12345');
    
    // Ocultar teclado
    if (device.getPlatform() === 'ios') {
      await element(by.text('Iniciar Sesión')).tapAtPoint({ x: 0, y: 0 });
    } else {
      await device.pressBack();
    }
    
    await element(by.text('Iniciar Sesión')).tap();
    
    // Esperar a que cargue el Dashboard
    await waitFor(element(by.text('📊 Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Verificar datos del usuario en Dashboard
    await expect(element(by.text('Ronny Melo'))).toBeVisible();
    await expect(element(by.text('ronny@correo.com'))).toBeVisible();
    await expect(element(by.text('ADMINISTRADOR'))).toBeVisible();
  });

  // ============================================
  // TEST 5: Navegación a Funcionalidades Nativas desde Dashboard
  // ============================================
  it('debe navegar a Funcionalidades Nativas y ver ambas secciones', async () => {
    // Primero hacer login
    await element(by.text('Ir a Login')).tap();
    await element(by.placeholder('Email')).clearText();
    await element(by.placeholder('Email')).typeText('ronny@correo.com');
    await element(by.placeholder('Contraseña')).clearText();
    await element(by.placeholder('Contraseña')).typeText('12345');
    
    if (device.getPlatform() === 'ios') {
      await element(by.text('Iniciar Sesión')).tapAtPoint({ x: 0, y: 0 });
    }
    
    await element(by.text('Iniciar Sesión')).tap();
    
    // Esperar Dashboard
    await waitFor(element(by.text('📊 Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Navegar a Funcionalidades Nativas
    await element(by.text('📱 Funcionalidades Nativas')).tap();
    
    // Verificar pantalla de Funcionalidades Nativas
    await expect(element(by.text('📱 Funcionalidades Nativas'))).toBeVisible();
    await expect(element(by.text('📸 Cámara'))).toBeVisible();
    await expect(element(by.text('📁 Sistema de Archivos'))).toBeVisible();
  });

  // ============================================
  // TEST 6: Cerrar sesión
  // ============================================
  it('debe cerrar sesión correctamente y volver al Home', async () => {
    // Login
    await element(by.text('Ir a Login')).tap();
    await element(by.placeholder('Email')).clearText();
    await element(by.placeholder('Email')).typeText('ronny@correo.com');
    await element(by.placeholder('Contraseña')).clearText();
    await element(by.placeholder('Contraseña')).typeText('12345');
    await element(by.text('Iniciar Sesión')).tap();
    
    // Esperar Dashboard
    await waitFor(element(by.text('📊 Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Cerrar sesión
    await element(by.text('🚪 CERRAR SESIÓN')).tap();
    
    // Confirmar en el diálogo de alerta
    if (device.getPlatform() === 'ios') {
      await element(by.label('Sí, salir')).tap();
    } else {
      await element(by.text('Sí, salir')).tap();
    }
    
    // Verificar que volvemos al Home
    await expect(element(by.text('🏠 Home Screen'))).toBeVisible();
  });

  // ============================================
  // TEST 7: Navegación directa a Registro
  // ============================================
  it('debe navegar a la pantalla de Registro', async () => {
    await element(by.text('📝 Ir a Registro')).tap();
    
    await expect(element(by.text('📝 Registro'))).toBeVisible();
    await expect(element(by.placeholder('Nombre completo'))).toBeVisible();
    await expect(element(by.placeholder('Email'))).toBeVisible();
    await expect(element(by.placeholder('Contraseña (mínimo 6 caracteres)'))).toBeVisible();
  });

  // ============================================
  // TEST 8: Navegación a Recuperar Contraseña
  // ============================================
  it('debe navegar a la pantalla de Recuperar Contraseña', async () => {
    await element(by.text('🔐 Recuperar Contraseña')).tap();
    
    await expect(element(by.text('🔐 Recuperar Contraseña'))).toBeVisible();
    await expect(element(by.placeholder('tu@email.com'))).toBeVisible();
    await expect(element(by.text('Enviar instrucciones'))).toBeVisible();
  });
});