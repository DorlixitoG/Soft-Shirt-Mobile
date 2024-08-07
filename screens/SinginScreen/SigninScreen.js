import {
  Text,
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import Logo from "../../assets/images/Logo_1.png";
import { CustomInput } from "../../components";
import { CustomButton } from "../../components";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SigninScreen = () => {
  const [Usuario, setUsuario] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPressed = async () => {
    try {
      const response = await axios.post(
        "https://back-end1-9e2f0d364f68.herokuapp.com/api/authMovil/login",
        {
          Usuario,
          Contrasenia,
        },
      );
      if (response.data.success) {
        const { token, expiresAt } = response.data;
        await AsyncStorage.setItem(
          "authToken",
          JSON.stringify({ token, expiresAt }),
        );
        await AsyncStorage.setItem("Usuario", Usuario);
        navigation.navigate("App");
      } else {
        setErrorMessage(response.data.message || "Inicio de sesión fallido");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "Error en la respuesta del servidor",
        );
        console.error(
          "Error en la respuesta del servidor:",
          error.response.data,
        );
      } else if (error.request) {
        setErrorMessage(
          "Error en la solicitud. Verifica tu conexión a internet.",
        );
        console.error("Error en la solicitud:", error.request);
      } else {
        setErrorMessage(
          "Error al configurar la solicitud. Intenta nuevamente.",
        );
        console.error("Error al configurar la solicitud:", error.message);
      }
    }
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate("ForgotPassword");
  };

  // Función para manejar el cambio de visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.welcomeText}>¡Bienvenido a Soft-Shirt!</Text>
      <Image
        source={Logo}
        style={[styles.logo, { height: height * 0.3 }]}
        resizeMode="contain"
      />
      <CustomInput
        placeholder="Usuario"
        value={Usuario}
        setValue={setUsuario}
        iconName="user" // Ícono de FontAwesome para el campo Usuario
      />
      <CustomInput
        placeholder="Contraseña"
        value={Contrasenia}
        setValue={setContrasenia}
        secureTextEntry={!showPassword} // Controla si el campo es de tipo contraseña
        togglePasswordVisibility={togglePasswordVisibility}
        iconName="lock" // Ícono de FontAwesome para el campo Contraseña
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <CustomButton text="Iniciar Sesión" onPress={onSignInPressed} />
      <CustomButton
        text="¿Olvidaste tu contraseña?"
        onPress={onForgotPasswordPressed}
        type="TERTIARY"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20, // Ajusta la distancia entre el mensaje de bienvenida y el logo
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    marginBottom: 20, // Ajusta la distancia entre el logo y los campos
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default SigninScreen;
