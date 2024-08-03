// LoadingScreen.js
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    // Simula un retraso para la pantalla de carga
    // eslint-disable-next-line no-undef
    const timer = setTimeout(() => {
      // Navegar a la pantalla de inicio de sesión después de 2 segundos
      navigation.replace("SignIn");
    }, 2000); // Puedes ajustar el tiempo según tus necesidades

    // Limpiar el temporizador cuando el componente se desmonte
    // eslint-disable-next-line no-undef
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#01c05f" />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
});

export default LoadingScreen;
