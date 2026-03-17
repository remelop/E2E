import * as SecureStore from 'expo-secure-store';

// IMPORTANTE: Cambia '192.168.1.XX' por tu dirección IPv4 real
const API_URL = 'XX:3000';

export const loginWithJWT = async (email, password) => {
try {
const response = await fetch(API_URL + '/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email: email, password: password }),
});

};