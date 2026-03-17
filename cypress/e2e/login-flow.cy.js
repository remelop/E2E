// cypress/e2e/login-flow.cy.js
describe('🎬 Prueba E2E - Flujo de Login en Web', () => {

  beforeEach(() => {
    // Visita la aplicación antes de cada prueba
    cy.visit('http://localhost:19006');
  });

  // ============================================
  // TEST 1: Verificar pantalla de Home
  // ============================================
  it('debe mostrar la pantalla de Home correctamente', () => {
    cy.contains('🏠 Home Screen').should('be.visible');
    cy.contains('Ir a Login').should('be.visible');
    cy.contains('📝 Ir a Registro').should('be.visible');
    cy.contains('📱 Funcionalidades Nativas').should('be.visible');
  });

  // ============================================
  // TEST 2: Navegar a Login
  // ============================================
  it('debe navegar a la pantalla de Login', () => {
    cy.contains('Ir a Login').click();
    cy.contains('🔐 Login JWT').should('be.visible');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Contraseña"]').should('be.visible');
  });

  // ============================================
  // TEST 3: Validación de campos vacíos
  // ============================================
  it('debe mostrar alerta con campos vacíos', () => {
    cy.contains('Ir a Login').click();
    
    // Limpiar campos (por defecto tienen valores)
    cy.get('input[placeholder="Email"]').clear();
    cy.get('input[placeholder="Contraseña"]').clear();
    
    // Interceptar alerta
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Completa todos los campos');
    });
    
    cy.contains('Iniciar Sesión').click();
  });

  // ============================================
  // TEST 4: Login exitoso
  // ============================================
  it('debe hacer login exitoso y mostrar Dashboard', () => {
    cy.contains('Ir a Login').click();
    
    // Ingresar credenciales
    cy.get('input[placeholder="Email"]').clear().type('ronny@correo.com');
    cy.get('input[placeholder="Contraseña"]').clear().type('12345');
    
    cy.contains('Iniciar Sesión').click();
    
    // Verificar Dashboard
    cy.contains('📊 Dashboard', { timeout: 5000 }).should('be.visible');
    cy.contains('Ronny Melo').should('be.visible');
    cy.contains('ADMINISTRADOR').should('be.visible');
  });

  // ============================================
  // TEST 5: Cerrar sesión
  // ============================================
  it('debe cerrar sesión correctamente', () => {
    // Login primero
    cy.contains('Ir a Login').click();
    cy.get('input[placeholder="Email"]').clear().type('ronny@correo.com');
    cy.get('input[placeholder="Contraseña"]').clear().type('12345');
    cy.contains('Iniciar Sesión').click();
    
    // Esperar Dashboard
    cy.contains('📊 Dashboard', { timeout: 5000 }).should('be.visible');
    
    // Cerrar sesión
    cy.contains('🚪 CERRAR SESIÓN').click();
    
    // Confirmar (manejar alerta)
    cy.on('window:confirm', () => true);
    
    // Verificar que volvió al Home
    cy.contains('🏠 Home Screen').should('be.visible');
  });
});