// Importaciones necesarias
import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { CustomInput as CustomInput } from "../../components";
import { CustomButton as CustomButton } from "../../components";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";

// Componente ForgotPasswordScreen
const ForgotPasswordScreen = () => {
  // Estados locales para manejar el correo, alertas y navegación
  const [Correo, setCorreo] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const navigation = useNavigation();

  // Función que se ejecuta al presionar el botón "Enviar"
  const onSendPressed = async () => {
    try {
      // Envío de solicitud POST para recuperación de contraseña
      const response = await axios.post(
        "https://back-end1-9e2f0d364f68.herokuapp.com/api/forgot-password",
        { Correo },
      );
      console.log("Respuesta del servidor:", response.data);
      const { resetCode } = response.data;
      if (resetCode) {
        // Almacena el código de verificación y el correo del usuario
        await AsyncStorage.setItem("verificationCode", resetCode);
        await AsyncStorage.setItem("userEmail", Correo);
        setAlertTitle("Código enviado");
        setAlertMessage(
          `El código de verificación fue enviado al correo ${Correo}`,
        );
        setShowAlert(true);
      } else {
        // Maneja el caso donde no se recibe el código de verificación
        console.error(
          "Código de verificación no recibido o formato incorrecto.",
        );
        setAlertTitle("Error");
        setAlertMessage(
          "No se pudo enviar el código de verificación. Por favor, intenta nuevamente.",
        );
        setShowAlert(true);
      }
    } catch (error) {
      // Maneja errores en la solicitud de recuperación de contraseña
      console.error(
        "Error al enviar la solicitud de recuperación de contraseña:",
        error,
      );
      setAlertTitle("Error");
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAlertMessage(error.response.data.message);
      } else {
        setAlertMessage(
          "Error al enviar la solicitud de recuperación de contraseña. Por favor, intenta nuevamente.",
        );
      }
      setShowAlert(true);
    }
  };

  // Función para manejar la confirmación del alert
  const handleAlertConfirm = () => {
    setShowAlert(false);
    if (alertTitle === "Código enviado") {
      navigation.navigate("CodigoVerificacionScreen");
    }
  };

  // Función para navegar de vuelta a la pantalla de inicio de sesión
  const backSingIn = () => {
    navigation.navigate("SignIn");
  };

  // Renderizado del componente
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Text style={styles.title}>Restablece tu contraseña</Text>
        <CustomInput
          placeholder="Ingresa el correo asociado al usuario"
          value={Correo}
          setValue={setCorreo}
        />
        <CustomButton text="Enviar" onPress={onSendPressed} />
        <CustomButton
          text="Volver al Inicio de sesión"
          onPress={backSingIn}
          type="TERTIARY"
        />
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={alertTitle}
          message={alertMessage}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#01c05f"
          onConfirmPressed={handleAlertConfirm}
        />
      </View>
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  root: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
});

export default ForgotPasswordScreen;
