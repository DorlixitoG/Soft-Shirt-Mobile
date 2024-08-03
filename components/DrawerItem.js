import React from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import argonTheme from "../constants/Theme";

// Componente DrawerItem para elementos en el menú lateral
const DrawerItem = ({ navigation, title, focused = false, onPress }) => {
  // Maneja la acción cuando se presiona el ítem del menú
  const handlePress = () => {
    if (title === "Cerrar sesión") {
      if (onPress) onPress(); // Llamar a la función onPress para cerrar sesión
    } else if (title === "Productos") {
      navigation.navigate("HomeScreen");
    } else if (title === "Compras") {
      navigation.navigate("ComprasScreen");
    }
  };

  // Renderiza el ícono correspondiente basado en el título
  const renderIcon = () => {
    switch (title) {
      case "Productos":
        return (
          <Icon
            name="shopping-bag"
            size={16}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Compras":
        return (
          <Icon
            name="cart-plus"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Cerrar sesión":
        return (
          <Icon
            name="sign-out"
            size={16}
            color={focused ? "white" : argonTheme.COLORS.ERROR}
          />
        );
      default:
        return null;
    }
  };

  // Define los estilos para el contenedor del ítem basado en si está enfocado
  const containerStyles = [
    styles.defaultStyle,
    focused ? [styles.activeStyle, styles.shadow] : null,
  ];

  return (
    <Pressable style={{ height: 60 }} onPress={handlePress}>
      <View style={containerStyles}>
        <View style={styles.iconContainer}>{renderIcon()}</View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text,
              { color: focused ? "white" : "rgba(0,0,0,0.5)" },
              focused && styles.boldText,
            ]}
          >
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 5,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default DrawerItem;
