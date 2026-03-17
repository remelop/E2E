// jest.setup.js - VERSIÓN COMPLETA Y CORREGIDA

// ============================================
// MOCK PARA REACT NATIVE GESTURE HANDLER
// ============================================
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: jest.fn(),
  DrawerLayout: jest.fn(),
  State: {},
  ScrollView: jest.fn(),
  Slider: jest.fn(),
  Switch: jest.fn(),
  TextInput: jest.fn(),
  ToolbarAndroid: jest.fn(),
  ViewPagerAndroid: jest.fn(),
  DrawerLayoutAndroid: jest.fn(),
  WebView: jest.fn(),
  PanGestureHandler: jest.fn(),
  TapGestureHandler: jest.fn(),
  LongPressGestureHandler: jest.fn(),
  PinchGestureHandler: jest.fn(),
  RotationGestureHandler: jest.fn(),
  FlingGestureHandler: jest.fn(),
  createNativeWrapper: jest.fn(),
  gestureHandlerRootHOC: jest.fn(),
  Directions: {}
}));

// ============================================
// MOCK PARA FIREBASE
// ============================================
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn()
}));

// ============================================
// MOCK PARA EXPO SECURE STORE
// ============================================
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(true),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(true)
}));

// ============================================
// MOCK PARA CONFIG (URL DE API)
// ============================================
jest.mock('./config', () => ({
  API_URL: 'http://localhost:3000'
}));

// ============================================
// MOCK PARA EXPO CAMERA
// ============================================
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    getCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    Constants: {
      Type: { back: 'back', front: 'front' }
    }
  },
  CameraType: { back: 'back', front: 'front' },
  useCameraPermissions: jest.fn().mockReturnValue([{ granted: true }, jest.fn()])
}));

// ============================================
// MOCK PARA EXPO LOCATION
// ============================================
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      accuracy: 10
    }
  }),
  getLastKnownPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      accuracy: 10
    }
  }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([{
    street: 'Calle Test',
    city: 'Ciudad Test',
    country: 'País Test'
  }]),
  Accuracy: {}
}));

// ============================================
// MOCK PARA EXPO FILE SYSTEM
// ============================================
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://document/',
  cacheDirectory: 'file://cache/',
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true, size: 1024 }),
  readAsStringAsync: jest.fn().mockResolvedValue('Contenido de prueba'),
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  deleteAsync: jest.fn().mockResolvedValue(undefined)
}));

// ============================================
// MOCK PARA EXPO DOCUMENT PICKER
// ============================================
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{
      name: 'test.txt',
      size: 1024,
      uri: 'file://test.txt',
      mimeType: 'text/plain'
    }]
  })
}));

// ============================================
// MOCK PARA EXPO MEDIA LIBRARY
// ============================================
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  saveToLibraryAsync: jest.fn().mockResolvedValue(undefined),
  usePermissions: jest.fn().mockReturnValue([{ granted: true }, jest.fn()])
}));

// ============================================
// MOCK PARA REACT NATIVE ANIMATED
// ============================================
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// ============================================
// MOCK PARA REACT NATIVE ALERT
// ============================================
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn()
}));

// ============================================
// MOCK PARA EXPO ROUTER (si lo usas)
// ============================================
// jest.mock('expo-router', () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//     replace: jest.fn(),
//     back: jest.fn()
//   })
// }));

// ============================================
// NOTA: El mock de AuthContext está comentado intencionalmente
// porque se mockea directamente en cada archivo de prueba
// para mayor control y flexibilidad
// ============================================
// jest.mock('./context/AuthContext', () => ({
//   useAuth: () => ({
//     user: null,
//     isLoading: false,
//     login: jest.fn(),
//     logout: jest.fn(),
//     isAuthenticated: false
//   }),
//   AuthProvider: ({ children }) => children
// }));

// ============================================
// CONFIGURACIÓN GLOBAL DE JEST
// ============================================
jest.setTimeout(10000); // 10 segundos de timeout para pruebas

// ============================================
// SILENCIAR CONSOLA DURANTE PRUEBAS (opcional)
// ============================================
// global.console = {
//   ...console,
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
// };