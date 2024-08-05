// components/LogoutConfirmation.js
import React, { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LogoutConfirmation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const handleBackPress = () => {
      setIsVisible(true);
      return true; // Evita que el comportamiento predeterminado de retroceso ocurra
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("Usuario");
    setIsVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <AwesomeAlert
        show={isVisible}
        showProgress={false}
        title="Atención"
        message="¿Quieres cerrar sesión?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton
        confirmText="Cerrar sesión"
        confirmButtonColor="#ff6347" // Color del botón de confirmar
        onConfirmPressed={handleLogout}
        showCancelButton
        cancelText="Cancelar"
        cancelButtonColor="#999" // Color del botón de cancelar
        onCancelPressed={handleCancel}
      />
    </>
  );
};

export default LogoutConfirmation;
