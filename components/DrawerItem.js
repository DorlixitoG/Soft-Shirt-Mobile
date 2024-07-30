import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Block, Text } from "galio-framework";
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
            color={focused ? "white" : argonTheme.COLORS.ERROR}
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
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          {renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text
            size={15}
            bold={focused}
            color={focused ? "white" : "rgba(0,0,0,0.5)"}
          >
            {title}
          </Text>
        </Block>
      </Block>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4,
  },
  shadow: {
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Actualizado
  },
});

export default DrawerItem;
