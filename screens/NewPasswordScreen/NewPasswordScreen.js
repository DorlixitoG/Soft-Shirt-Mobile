import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { CustomInput } from "../../components";
import { CustomButton } from "../../components";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";

// Componente principal para la pantalla de restablecimiento de contraseña
const NewPasswordScreen = () => {
  // Definición de estados
  const [nuevaContrasenia, setnuevaContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");

  // Hook para obtener el correo del usuario almacenado en AsyncStorage
  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };

    fetchUserEmail();
  }, []);

  // Función para manejar el envío de la nueva contraseña
  const onSubmitPressed = async () => {
    try {
      await axios.post(
        "https://back-end1-9e2f0d364f68.herokuapp.com/api/reset-password",
        {
          nuevaContrasenia,
          Correo: userEmail,
        },
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
    }
  };

  // Función para manejar la confirmación de la alerta
  const handleAlertConfirm = () => {
    setShowAlert(false);
    navigation.navigate("SignIn");
  };

  // Función para manejar el cambio de visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para navegar a la pantalla de inicio de sesión
  const backSingIn = () => {
    navigation.navigate("SignIn");
  };

  // Renderizado del componente
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Text style={styles.title}>Restablece tu contraseña</Text>
        <CustomInput
          placeholder="Ingresa tu nueva contraseña"
          value={nuevaContrasenia}
          setValue={setnuevaContrasenia}
          secureTextEntry={!showPassword} // Controla si el campo es de tipo contraseña
          togglePasswordVisibility={togglePasswordVisibility} // Proporciona la función para alternar la visibilidad
        />
        <CustomButton text="Enviar" onPress={onSubmitPressed} />
        <CustomButton
          text="Volver al Inicio de sesión"
          onPress={backSingIn}
          type="TERTIARY"
        />
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Contraseña recuperada"
          message="Contraseña recuperada correctamente, intenta ingresar de nuevo."
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

export default NewPasswordScreen;
