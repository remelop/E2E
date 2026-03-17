// screens/NativeFeaturesScreen.js - VERSIÓN CON CÁMARA + SISTEMA DE ARCHIVOS
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as Camera from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export default function NativeFeaturesScreen() {
  // Estados para Cámara
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('pending');
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  // Estados para Sistema de Archivos
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [createdFile, setCreatedFile] = useState(null);
  const [loadingFile, setLoadingFile] = useState(false);

  // ============================================
  // VERIFICAR PERMISOS AL INICIAR
  // ============================================
  useEffect(() => {
    (async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
      setCameraPermissionStatus(status);
    })();
  }, []);

  // ============================================
  // FUNCIONALIDAD 1: CÁMARA
  // ============================================

  const abrirCamara = async () => {
    // Solicitar permiso si no lo tiene
    if (cameraPermissionStatus !== 'granted') {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
      setCameraPermissionStatus(status);
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para tomar fotos');
        return;
      }
    }

    // Verificar permisos de almacenamiento
    if (!mediaPermission?.granted) {
      await requestMediaPermission();
    }

    setCameraVisible(true);
  };

  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const foto = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false
        });
        
        setPhoto(foto.uri);
        setCameraVisible(false);

        // Guardar en la galería
        if (mediaPermission?.granted) {
          await MediaLibrary.saveToLibraryAsync(foto.uri);
          Alert.alert('Éxito', 'Foto guardada en la galería');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
        console.error(error);
      }
    }
  };

  const cerrarCamara = () => {
    setCameraVisible(false);
  };

  // ============================================
  // FUNCIONALIDAD 2: SISTEMA DE ARCHIVOS
  // ============================================

  // 2.1 SELECCIONAR ARCHIVO
  const seleccionarArchivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Todos los tipos de archivo
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setSelectedFile({
        name: file.name,
        size: file.size,
        uri: file.uri,
        mimeType: file.mimeType
      });

      // Si es un archivo de texto, leer su contenido
      if (file.mimeType?.startsWith('text/') || file.name.endsWith('.txt')) {
        try {
          const content = await FileSystem.readAsStringAsync(file.uri);
          setFileContent(content.substring(0, 200) + (content.length > 200 ? '...' : ''));
        } catch (readError) {
          console.log('No se pudo leer el contenido:', readError);
        }
      }

      Alert.alert('✅ Archivo seleccionado', file.name);
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
      console.error(error);
    }
  };

  // 2.2 CREAR ARCHIVO DE TEXTO
  const crearArchivoTexto = async () => {
    setLoadingFile(true);
    try {
      // Crear contenido del archivo
      const contenido = `Archivo creado desde la app
Fecha: ${new Date().toLocaleString()}
Plataforma: ${Platform.OS}
Funcionalidad: Sistema de Archivos - Semana 13`;

      // Definir ruta del archivo
      const fileName = `app_${Date.now()}.txt`;
      const filePath = FileSystem.documentDirectory + fileName;

      // Escribir archivo
      await FileSystem.writeAsStringAsync(filePath, contenido);

      // Leer para verificar
      const savedContent = await FileSystem.readAsStringAsync(filePath);

      setCreatedFile({
        name: fileName,
        path: filePath,
        content: savedContent
      });

      Alert.alert('✅ Archivo creado', `Guardado como: ${fileName}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el archivo');
      console.error(error);
    } finally {
      setLoadingFile(false);
    }
  };

  // 2.3 VER INFORMACIÓN DEL DIRECTORIO
  const verInfoDirectorio = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
      
      Alert.alert(
        '📁 Información del directorio',
        `Ruta: ${FileSystem.documentDirectory}\n\nExiste: ${dirInfo.exists ? 'Sí' : 'No'}\n${
          dirInfo.exists ? `Tamaño: ${dirInfo.size || 0} bytes` : ''
        }`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener información');
    }
  };

  // 2.4 ELIMINAR ARCHIVO CREADO
  const eliminarArchivo = async () => {
    if (!createdFile) return;

    try {
      await FileSystem.deleteAsync(createdFile.path);
      setCreatedFile(null);
      Alert.alert('✅ Archivo eliminado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el archivo');
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  if (cameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        <Camera.Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.CameraType.back}
          ratio="16:9"
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraButton} onPress={cerrarCamara}>
              <Text style={styles.cameraButtonText}>✕</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={tomarFoto}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </Camera.Camera>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📱 Funcionalidades Nativas</Text>
      <Text style={styles.subtitle}>Semana 13 - TICs</Text>
      <Text style={styles.platformInfo}>
        Plataforma: {Platform.OS === 'web' ? '🌐 Web' : '📱 Móvil'}
      </Text>

      {/* ======================================== */}
      {/* SECCIÓN CÁMARA */}
      {/* ======================================== */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📸 Cámara</Text>
        
        <View style={styles.permissionStatus}>
          <Text>Permiso cámara: </Text>
          <Text style={cameraPermission ? styles.granted : styles.denied}>
            {cameraPermission ? '✓ Concedido' : 
             cameraPermissionStatus === 'denied' ? '✗ Denegado' : '⚪ No solicitado'}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={abrirCamara}>
          <Text style={styles.buttonText}>Abrir Cámara</Text>
        </TouchableOpacity>

        {photo && (
          <View style={styles.photoPreview}>
            <Text style={styles.previewLabel}>Última foto:</Text>
            <Image source={{ uri: photo }} style={styles.previewImage} />
          </View>
        )}
      </View>

      {/* ======================================== */}
      {/* SECCIÓN SISTEMA DE ARCHIVOS */}
      {/* ======================================== */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📁 Sistema de Archivos</Text>

        {/* Botón 1: Seleccionar archivo */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#28a745' }]} 
          onPress={seleccionarArchivo}
        >
          <Text style={styles.buttonText}>📂 Seleccionar Archivo</Text>
        </TouchableOpacity>

        {selectedFile && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileLabel}>Archivo seleccionado:</Text>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
            <Text style={styles.fileSize}>
              Tamaño: {(selectedFile.size / 1024).toFixed(2)} KB
            </Text>
            {fileContent && (
              <View style={styles.filePreview}>
                <Text style={styles.previewLabel}>Vista previa:</Text>
                <Text style={styles.fileContent}>{fileContent}</Text>
              </View>
            )}
          </View>
        )}

        {/* Botón 2: Crear archivo */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#ff9800', marginTop: 10 }]} 
          onPress={crearArchivoTexto}
          disabled={loadingFile}
        >
          {loadingFile ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📝 Crear Archivo de Texto</Text>
          )}
        </TouchableOpacity>

        {createdFile && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileLabel}>Archivo creado:</Text>
            <Text style={styles.fileName}>{createdFile.name}</Text>
            <View style={styles.filePreview}>
              <Text style={styles.previewLabel}>Contenido:</Text>
              <Text style={styles.fileContent}>{createdFile.content}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.smallButton, { backgroundColor: '#dc3545', marginTop: 10 }]} 
              onPress={eliminarArchivo}
            >
              <Text style={styles.smallButtonText}>🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botón 3: Info del directorio */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#17a2b8', marginTop: 10 }]} 
          onPress={verInfoDirectorio}
        >
          <Text style={styles.buttonText}>ℹ️ Info del Directorio</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Permisos solicitados bajo principio de mínimo acceso
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  platformInfo: {
    fontSize: 14,
    color: '#9c27b0',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  permissionStatus: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  granted: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  denied: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  photoPreview: {
    marginTop: 15,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  fileInfo: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  fileLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  fileName: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 5,
  },
  filePreview: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  fileContent: {
    fontSize: 12,
    color: '#495057',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6c757d',
    marginTop: 20,
    marginBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 30,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
});