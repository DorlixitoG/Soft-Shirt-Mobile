import { Block, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { DrawerItem as DrawerCustomItem } from "../components";
import Images from "../constants/Images";
import React from "react";

function CustomDrawerContent({
  drawerPosition, // Posición del drawer (izquierda o derecha)
  navigation, // Objeto de navegación para cambiar pantallas
  profile, // Información del perfil (no se usa en este fragmento)
  focused, // Estado de enfoque (no se usa en este fragmento)
  state, // Estado de la navegación (para saber qué pantalla está activa)
  ...rest // Propiedades adicionales (no usadas en este fragmento)
}) {
  // Lista de pantallas que se mostrarán en el drawer
  const screens = ["Productos", "Compras"];

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Implementa aquí la lógica para cerrar sesión
    navigation.navigate("SignIn"); // Navega a la pantalla de inicio de sesión
  };

  return (
    <Block
      style={styles.container} // Aplicar estilos al contenedor principal
      forceInset={{ top: "always", horizontal: "never" }} // Configura el espaciado en los bordes del drawer
    >
      <View style={styles.header}>
        <Image style={styles.logo} source={Images.Logo} />
      </View>
      <Block flex style={styles.menuContainer}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Mapea las pantallas y crea un item para cada una */}
          {screens.map((item, index) => (
            <DrawerCustomItem
              title={item}
              key={index}
              navigation={navigation} // Pasa el objeto de navegación
              focused={state.index === index ? true : false} // Marca el item como enfocado si el índice coincide
            />
          ))}
        </ScrollView>
        <View style={styles.logoutContainer}>
          {/* Botón para cerrar sesión */}
          <DrawerCustomItem title="Cerrar sesión" onPress={handleLogout} />
        </View>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Permite que el contenedor ocupe todo el espacio disponible
  },
  header: {
    paddingHorizontal: 28, // Espaciado horizontal
    paddingBottom: theme.SIZES.BASE, // Espaciado inferior
    paddingTop: theme.SIZES.BASE * 3, // Espaciado superior
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
  },
  logo: {
    width: 100, // Ancho del logo
    height: 100, // Alto del logo
    resizeMode: "contain", // Asegura que el logo se ajuste al contenedor sin distorsionar
  },
  menuContainer: {
    flex: 1, // Ocupa el espacio restante
    flexDirection: "column", // Dispone los elementos en una columna
    justifyContent: "space-between", // Espacia el contenido para que esté separado del botón de cierre de sesión
  },
  logoutContainer: {
    padding: 16, // Espaciado alrededor del botón de cierre de sesión
  },
});

export default CustomDrawerContent;
