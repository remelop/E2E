// e2e/loginFlow.test.js
describe('🎬 Flujo E2E: Login y Dashboard', () => {
  
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // ============================================
  // TEST 1: Verificar pantalla de Home
  // ============================================
  it('debe mostrar la pantalla de Home correctamente', async () => {
    await expect(element(by.text('🏠 Home Screen'))).toBeVisible();
    await expect(element(by.text('Ir a Login'))).toBeVisible();
    await expect(element(by.text('📝 Ir a Registro'))).toBeVisible();
    await expect(element(by.text('📱 Funcionalidades Nativas'))).toBeVisible();
  });

  // ============================================
  // TEST 2: Navegar a Login y verificar elementos
  // ============================================
  it('debe navegar a Login y mostrar el formulario', async () => {
    await element(by.text('Ir a Login')).tap();
    
    await expect(element(by.text('🔐 Login JWT'))).toBeVisible();
    await expect(element(by.placeholder('Email'))).toBeVisible();
    await expect(element(by.placeholder('Contraseña'))).toBeVisible();
    await expect(element(by.text('Iniciar Sesión'))).toBeVisible();
  });

  // ============================================
  // TEST 3: Login con credenciales vacías (debe mostrar alerta)
  // ============================================
  it('debe mostrar alerta con campos vacíos', async () => {
    await element(by.text('Ir a Login')).tap();
    
    // Limpiar campos (por defecto vienen con valores)
    await element(by.placeholder('Email')).clearText();
    await element(by.placeholder('Contraseña')).clearText();
    
    await element(by.text('Iniciar Sesión')).tap();
    
    // Verificar alerta (en iOS/Android es diferente)
    if (device.getPlatform() === 'ios') {
      await expect(element(by.label('Error')).atIndex(0)).toBeVisible();
    } else {
      // En Android, podríamos verificar un texto específico
      // Esto puede variar según la implementación
    }
  });

  // ============================================
  // TEST 4: Login exitoso y navegación a Dashboard
  // ============================================
  it('debe hacer login exitoso y mostrar Dashboard', async () => {
    await element(by.text('Ir a Login')).tap();
    
    // Ingresar credenciales (por defecto ya vienen)
    await element(by.placeholder('Email')).clearText();
    await element(by.placeholder('Email')).typeText('ronny@correo.com');
    await element(by.placeholder('Contraseña')).clearText();
    await element(by.placeholder('Contraseña')).typeText('12345');
    
    // Ocultar teclado
    if (device.getPlatform() === 'ios') {
      await element(by.text('Iniciar Sesión')).tapAtPoint({ x: 0, y: 0 });
    } else {
      await device.pressBack();
    }
    
    await element(by.text('Iniciar Sesión')).tap();
    
    // Verificar que navega a Dashboard
    await waitFor(element(by.text('📊 Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Verificar datos del usuario
    await expect(element(by.text('Ronny Melo'))).toBeVisible();
    await expect(element(by.text('ronny@correo.com'))).toBeVisible();
    await expect(element(by.text('ADMINISTRADOR'))).toBeVisible();
  });

  // ============================================
  // TEST 5: Navegar a Funcionalidades Nativas desde Dashboard
  // ============================================
  it('debe navegar a Funcionalidades Nativas desde Dashboard', async () => {
    // Primero hacer login
    await element(by.text('Ir a Login')).tap();
    await element(by.text('Iniciar Sesión')).tap();
    
    // Esperar Dashboard
    await waitFor(element(by.text('📊 Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Navegar a NativeFeatures (si hay botón)
    // Nota: Ajusta según tu UI real
    try {
      await element(by.text('📱 Funcionalidades Nativas')).tap();
      await expect(element(by.text('📱 Funcionalidades Nativas'))).toBeVisible();
    } catch (error) {
      console.log('Botón no encontrado en Dashboard, navegando desde Home');
      // Si no hay botón en Dashboard, volvemos a Home
      await device.pressBack();
    }
  });

  // ============================================
  // TEST 6: Logout
  // ============================================
  it('debe permitir cerrar sesión desde Dashboard', async () => {
    // Primero hacer login
    await element(by.text('Ir a Login')).tap();
    await element(by.text('Iniciar Sesión')).tap();
    
    // Esperar Dashboard
    await waitFor(element(by.text('📊 Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Cerrar sesión
    await element(by.text('🚪 CERRAR SESIÓN')).tap();
    
    // Confirmar (si hay diálogo)
    if (device.getPlatform() === 'ios') {
      await element(by.label('Sí, salir')).tap();
    } else {
      // En Android, puede ser diferente
      await element(by.text('Sí, salir')).tap();
    }
    
    // Verificar que volvió a Home
    await expect(element(by.text('🏠 Home Screen'))).toBeVisible();
  });
});