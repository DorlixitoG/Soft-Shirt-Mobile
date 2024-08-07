import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Screens from "./navigation/Screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";

enableScreens();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem("authToken");
        if (tokenData) {
          const { token, expiresAt } = JSON.parse(tokenData);
          const now = Date.now();

          if (now < expiresAt) {
            // Token is still valid
            setIsLoggedIn(true);
          } else {
            // Token has expired
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("Usuario");

            setIsLoggedIn(false);
            setShowAlert(true); // Show alert if token expired
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("Usuario");
        setIsLoggedIn(false);
        setShowAlert(true); // Show alert in case of error
      }
    };

    checkToken();
  }, []);

  const handleAlertClose = () => {
    setShowAlert(false);
    // Optionally navigate to login screen or perform other actions
  };

  if (isLoggedIn === null) {
    // Opcionalmente, puedes mostrar una pantalla de carga mientras verificas el estado de la autenticación
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Screens isLoggedIn={isLoggedIn} />
        <AwesomeAlert
          show={showAlert}
          title="Sesión Expirada"
          message="Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          closeOnTouchOutside={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#01c05f"
          onConfirmPressed={handleAlertClose}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
