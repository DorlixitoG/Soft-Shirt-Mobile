import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";

const CodigoVerificacionScreen = () => {
  // Estado para almacenar el código ingresado por el usuario
  const [code, setCode] = useState("");
  // Estado para almacenar el código recuperado del almacenamiento local
  const [storedCode, setStoredCode] = useState("");
  // Estado para manejar la visibilidad del alerta
  const [showAlert, setShowAlert] = useState(false);
  // Estado para manejar el título del alerta
  const [alertTitle, setAlertTitle] = useState("");
  // Estado para manejar el mensaje del alerta
  const [alertMessage, setAlertMessage] = useState("");
  // Hook para navegación entre pantallas
  const navigation = useNavigation();

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    // Función asíncrona para recuperar el código de verificación del almacenamiento local
    const fetchCode = async () => {
      try {
        // Recupera el código de verificación guardado en AsyncStorage
        const code = await AsyncStorage.getItem("verificationCode");
        setStoredCode(code || ""); // Actualiza el estado con el código recuperado
        console.log("Código recuperado:", code); // Verifica que el código se recupere
      } catch (error) {
        console.error("Error al recuperar el código:", error); // Manejo de errores
      }
    };
    fetchCode(); // Llama a la función para recuperar el código
  }, []);

  // Función para manejar la verificación del código ingresado
  const handleVerify = async () => {
    try {
      if (code === storedCode) {
        // Si el código ingresado es correcto, navega a la pantalla de nueva contraseña
        navigation.navigate("NewPasswordScreen");
      } else {
        // Si el código es incorrecto, muestra una alerta
        setAlertTitle("Error");
        setAlertMessage("Código de verificación incorrecto. Intenta de nuevo.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error al verificar el código:", error); // Manejo de errores
    }
  };

  // Función para manejar el cambio en el campo de entrada del código
  const handleChange = (text) => {
    // Asegúrate de que el texto ingresado solo contenga números
    const numericText = text.replace(/[^0-9]/g, "");
    setCode(numericText); // Actualiza el estado con el texto numérico
  };

  // Función para manejar la confirmación del alerta
  const handleAlertConfirm = () => {
    setShowAlert(false); // Oculta el alerta
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Código de verificación</Text>
        <Text style={styles.message}>
          Enviamos un código de verificación a tu correo electrónico
        </Text>

        <TextInput
          style={styles.input}
          maxLength={6} // Limita la longitud máxima del código a 6 caracteres
          inputMode="numeric" // Asegura que solo se ingresen números
          onChangeText={handleChange} // Actualiza el estado con el texto ingresado
          value={code} // Valor del campo de entrada
        />

        <Pressable style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verificar</Text>
        </Pressable>
      </View>
      <AwesomeAlert
        show={showAlert} // Muestra el alerta si showAlert es verdadero
        showProgress={false} // No muestra una barra de progreso
        title={alertTitle} // Título del alerta
        message={alertMessage} // Mensaje del alerta
        closeOnTouchOutside={false} // No cierra el alerta al tocar fuera de él
        closeOnHardwareBackPress={false} // No cierra el alerta al presionar el botón de retroceso del hardware
        showConfirmButton={true} // Muestra el botón de confirmación
        confirmText="OK" // Texto del botón de confirmación
        confirmButtonColor="#01c05f" // Color del botón de confirmación
        onConfirmPressed={handleAlertConfirm} // Función para manejar la confirmación del alerta
      />
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16796f",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: 300,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Nota: `boxShadow` no está soportado en React Native, usar `elevation` en lugar
    elevation: 5,
  },
  title: {
    color: "#16796f",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    textAlign: "center",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: 10,
    backgroundColor: "#7cb7af",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default CodigoVerificacionScreen;
