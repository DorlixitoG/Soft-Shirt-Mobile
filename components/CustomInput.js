import { View, TextInput, StyleSheet, Pressable } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Importa FontAwesome

// Componente CustomInput para un campo de entrada de texto personalizado
const CustomInput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  togglePasswordVisibility,
  iconName,
}) => {
  return (
    <View style={styles.container}>
      {iconName && (
        <FontAwesome
          name={iconName}
          size={20}
          color="#888"
          style={styles.icon}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureTextEntry} // Controla si el campo es de tipo contraseña
      />
      {togglePasswordVisibility && (
        <Pressable
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <FontAwesome
            name={secureTextEntry ? "eye-slash" : "eye"}
            size={20}
            color="#888"
          />
        </Pressable>
      )}
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
    flexDirection: "row", // Alinea el ícono y el campo de entrada horizontalmente
    alignItems: "center", // Alinea verticalmente el ícono y el campo de entrada
  },
  input: {
    width: "85%", // Ajusta el ancho para dar espacio al ícono
    height: 40, // Altura del campo de entrada
    paddingHorizontal: 10, // Espaciado horizontal dentro del campo de entrada
  },
  icon: {
    marginRight: 10, // Espaciado entre el ícono y el campo de entrada
  },
  iconContainer: {
    position: "absolute", // Ubica el ícono de forma absoluta
    right: 10, // Ubica el ícono a la derecha
  },
});

export default CustomInput;
