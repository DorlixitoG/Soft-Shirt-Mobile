import React, { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";

// Habilita el uso de pantallas nativas en React Native para mejorar el rendimiento
import { enableScreens } from "react-native-screens";
import Screens from "./navigation/Screens";
import { Images, argonTheme } from "./constants";

// Habilitar el uso de pantallas nativas
enableScreens();

// Cachear imágenes de la aplicación
const assetImages = [Images.Logo];

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image); // Si la imagen es una URL, prefetch la imagen
    } else {
      return Asset.fromModule(image).downloadAsync(); // Si la imagen es un módulo, descarga la imagen
    }
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Cargar recursos
        await _loadResourcesAsync();
        // Pre-cargar fuentes, realizar llamadas a API necesarias aquí
        await Font.loadAsync({
          ArgonExtra: require("./assets/font/softshirt.ttf"), // Cargar una fuente personalizada
        });
      } catch (e) {
        console.warn(e); // Manejar cualquier error en la carga de recursos
      } finally {
        // Indicar a la aplicación que puede renderizar
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  // Función para cargar recursos
  const _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]); // Cachear imágenes
  };

  // Callback para ocultar la pantalla de splash una vez que la aplicación esté lista
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync(); // Ocultar la pantalla de splash
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // No renderizar nada hasta que la aplicación esté lista
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <GalioProvider theme={argonTheme}>
        <Block flex>
          <Screens />
        </Block>
      </GalioProvider>
    </NavigationContainer>
  );
}
