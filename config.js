// config.js
import { Platform } from 'react-native';

// IMPORTANTE: Cambia esta IP por la IP de tu computadora
// Para obtener tu IP: ipconfig (Windows) o ifconfig (Mac/Linux)
const IP = '172.16.45.81'; // <-- USA TU IP AQUÍ

export const API_URL = Platform.select({
  web: 'http://localhost:3000',           // Para navegador web
  android: `http://${IP}:3000`,            // Para emulador Android
  ios: `http://${IP}:3000`,                // Para iOS
  default: `http://${IP}:3000`
});

console.log('🌐 API Config - URL:', API_URL);