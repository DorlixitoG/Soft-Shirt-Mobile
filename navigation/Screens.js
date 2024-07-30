import { Dimensions } from "react-native";
import { Header } from "../components";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import CustomDrawerContent from "./Menu";
import HomeScreen from "../screens/HomeScreen";
import SigninScreen from "../screens/SinginScreen/SigninScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen/ForgotPasswordScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen";
import CodigoVerificacionScreen from "../screens/CodigoVerificacionScreen";
import ComprasScreen from "../screens/ComprasScreen";

// Obtiene el ancho de la pantalla para ajustar el estilo del drawer
const { width } = Dimensions.get("screen");

// Crea instancias de los navegadores de stack y drawer
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Componente para la pila de pantallas de la sección Home
function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card", // Estilo de transición para las pantallas
        headerShown: "screen", // Muestra el header en la pantalla
      }}
    >
      <Stack.Screen
        name="HomeScreenStack"
        component={HomeScreen} // Componente para la pantalla principal de Home
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="" // Título del header (vacío en este caso)
              search // Muestra el botón de búsqueda en el header
              options // Muestra el botón de opciones en el header
              navigation={navigation} // Pasa la navegación como prop
              scene={scene} // Pasa la escena como prop
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }, // Estilo del fondo de la tarjeta
        }}
      />
    </Stack.Navigator>
  );
}

// Componente para la pila de pantallas de la sección Compras
function ComprasStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card", // Estilo de transición para las pantallas
        headerShown: "screen", // Muestra el header en la pantalla
      }}
    >
      <Stack.Screen
        name="ComprasScreenStack"
        component={ComprasScreen} // Componente para la pantalla de Compras
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="" // Título del header (vacío en este caso)
              search // Muestra el botón de búsqueda en el header
              options // Muestra el botón de opciones en el header
              navigation={navigation} // Pasa la navegación como prop
              scene={scene} // Pasa la escena como prop
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }, // Estilo del fondo de la tarjeta
        }}
      />
    </Stack.Navigator>
  );
}

// Componente para la configuración del drawer principal
function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }} // Asegura que el drawer ocupe todo el espacio disponible
      drawerContent={(props) => <CustomDrawerContent {...props} />} // Configura el contenido del drawer
      drawerStyle={{
        backgroundColor: "white", // Color de fondo del drawer
        width: width * 0.8, // Ancho del drawer (80% del ancho de la pantalla)
      }}
      initialRouteName="HomeScreen" // Pantalla inicial cuando se abre el drawer
    >
      {/* Pantalla principal de Home */}
      <Drawer.Screen
        name="HomeScreen"
        component={HomeStack} // Muestra la pila de pantallas de Home
        options={{
          headerShown: false, // No muestra el header para esta pantalla
        }}
      />
      {/* Pantalla de Compras */}
      <Drawer.Screen
        name="ComprasScreen"
        component={ComprasStack} // Muestra la pila de pantallas de Compras
        options={{
          headerShown: false, // No muestra el header para esta pantalla
        }}
      />
    </Drawer.Navigator>
  );
}

// Componente principal de navegación para la aplicación
export default function OnboardingStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card", // Estilo de transición para las pantallas
        headerShown: false, // No muestra el header para las pantallas del onboarding
      }}
    >
      {/* Pantalla de inicio de sesión */}
      <Stack.Screen name="SignIn" component={SigninScreen} />
      {/* Pantalla principal de la aplicación */}
      <Stack.Screen name="App" component={AppStack} />
      {/* Pantalla para recuperación de contraseña */}
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      {/* Pantalla para establecer una nueva contraseña */}
      <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
      {/* Pantalla para verificar el código */}
      <Stack.Screen
        name="CodigoVerificacionScreen"
        component={CodigoVerificacionScreen}
      />
      {/* Pantalla de Compras (duplicado de la pantalla en el drawer) */}
      <Stack.Screen name="Compras" component={ComprasScreen} />
    </Stack.Navigator>
  );
}
