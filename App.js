import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

// Habilita el uso de pantallas nativas en React Native para mejorar el rendimiento
import { enableScreens } from "react-native-screens";

import Screens from "./navigation/Screens";

enableScreens();

export default function App() {
  return (
    <NavigationContainer>
      <Screens />
    </NavigationContainer>
  );
}
