import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Screens from "./navigation/Screens";
import AsyncStorage from "@react-native-async-storage/async-storage";

enableScreens();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        // Aquí podrías agregar más lógica para validar el token si es necesario
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);

  if (isLoggedIn === null) {
    // Opcionalmente, puedes mostrar una pantalla de carga mientras verificas el estado de la autenticación
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Screens isLoggedIn={isLoggedIn} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
