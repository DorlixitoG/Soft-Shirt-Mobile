import {
  Text,
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native"; // Importa componentes básicos de React Native
import React, { useState } from "react"; // Importa React y useState para manejar estados
import Logo from "../../assets/images/Logo_1.png"; // Importa el logo de la aplicación
import { CustomInput } from "../../components"; // Importa el componente CustomInput
import { CustomButton } from "../../components"; // Importa el componente CustomButton
import { useNavigation } from "@react-navigation/native"; // Importa el hook de navegación
import axios from "axios"; // Importa Axios para hacer solicitudes HTTP

const SigninScreen = () => {
  const [Usuario, setUsuario] = useState(""); // Estado para manejar el campo de usuario
  const [Contrasenia, setContrasenia] = useState(""); // Estado para manejar el campo de contraseña
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar mensajes de error

  const { height } = useWindowDimensions(); // Hook para obtener las dimensiones de la ventana
  const navigation = useNavigation(); // Hook para la navegación

  const onSignInPressed = async () => {
    try {
      // Hacer la solicitud POST a la API de autenticación
      const response = await axios.post(
        "https://prueba-despliegue-back.onrender.com/api/authMovil/login",
        {
          Usuario,
          Contrasenia,
        },
      );

      if (response.data.success) {
        // Si el inicio de sesión es exitoso, navega a la pantalla de inicio
        navigation.navigate("App");
      } else {
        // Maneja el error, por ejemplo, muestra un mensaje
        setErrorMessage(response.data.message || "Inicio de sesión fallido");
      }
    } catch (error) {
      if (error.response) {
        // Error en la respuesta del servidor
        setErrorMessage(
          error.response.data.message || "Error en la respuesta del servidor",
        );
        console.error(
          "Error en la respuesta del servidor:",
          error.response.data,
        );
      } else if (error.request) {
        // Error en la solicitud, posiblemente problema de conexión
        setErrorMessage(
          "Error en la solicitud. Verifica tu conexión a internet.",
        );
        console.error("Error en la solicitud:", error.request);
      } else {
        // Error al configurar la solicitud
        setErrorMessage(
          "Error al configurar la solicitud. Intenta nuevamente.",
        );
        console.error("Error al configurar la solicitud:", error.message);
      }
    }
  };

  const onForgotPasswordPressed = () => {
    // Navega a la pantalla de recuperación de contraseña
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, { height: height * 0.4 }]}
        resizeMode="contain"
      />
      <CustomInput
        placeholder="Usuario"
        value={Usuario}
        setValue={setUsuario}
      />
      <CustomInput
        placeholder="Contraseña"
        value={Contrasenia}
        setValue={setContrasenia}
        secureTextEntry={true}
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
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    maxheight: 200,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default SigninScreen;
