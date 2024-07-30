import { View, TextInput, StyleSheet } from "react-native";
import React from "react";

// Componente CustomInput para un campo de entrada de texto personalizado
const CustomInput = ({ value, setValue, placeholder, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value} // Valor actual del campo de entrada
        onChangeText={setValue} // Función para actualizar el valor del campo
        placeholder={placeholder} // Texto de marcador de posición
        style={styles.input} // Estilo aplicado al campo de entrada
        secureTextEntry={secureTextEntry} // Oculta el texto si es true (para contraseñas)
      />
    </View>
  );
};

// Define los estilos para el componente
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", // Color de fondo del contenedor
    width: "100%", // Ancho completo del contenedor
    borderColor: "#e8e8e8", // Color del borde
    borderWidth: 1, // Ancho del borde
    borderRadius: 5, // Radio del borde para esquinas redondeadas
    paddingHorizontal: 10, // Espaciado horizontal dentro del contenedor
    marginVertical: 5, // Espaciado vertical fuera del contenedor
  },
  input: {
    width: "100%", // Ancho completo del campo de entrada
    height: 40, // Altura del campo de entrada
    paddingHorizontal: 10, // Espaciado horizontal dentro del campo de entrada
  },
});

export default CustomInput;
