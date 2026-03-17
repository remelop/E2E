// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:19006/', // URL de tu app en Expo web
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  video: true, // Graba video de las pruebas
  screenshotOnRunFailure: true, // Toma captura si falla
  viewportWidth: 1280,
  viewportHeight: 720,
});