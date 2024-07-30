import React from "react";
import { StyleSheet, Platform, Dimensions } from "react-native";
import { Button, Block, NavBar, Text, theme } from "galio-framework";
import { useNavigation } from "@react-navigation/native";
import Icon from "./Icon";
import Tabs from "./Tabs";
import argonTheme from "../constants/Theme";

// Obtiene las dimensiones de la ventana
const { height, width } = Dimensions.get("window");
// Función para detectar si el dispositivo es un iPhone X o similar
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);

// Componente Header
const Header = ({
  back = false, // Si debe mostrar el botón de volver
  title = "", // Título de la cabecera
  white = false, // Si el texto debe ser blanco
  transparent = false, // Si el fondo debe ser transparente
  bgColor = null, // Color de fondo opcional
  iconColor = null, // Color del ícono opcional
  titleColor = null, // Color del título opcional
  optionLeft = null, // Opción a la izquierda en el header
  optionRight = null, // Opción a la derecha en el header
  tabs = null, // Pestañas opcionales
  tabIndex = null, // Índice de pestaña inicial
  ...props // Otras props adicionales
}) => {
  const navigation = useNavigation(); // Hook para obtener la navegación

  // Maneja la acción del botón de izquierda (volver o abrir menú)
  const handleLeftPress = () => {
    return back ? navigation.goBack() : navigation.openDrawer();
  };

  // Renderiza opciones específicas del header si el título coincide
  const renderRight = () => {
    switch (title) {
      case "Home":
      case "Compras":
      case "Profile":
      case "Search":
      case "Settings":
        // Aquí puedes añadir opciones específicas si es necesario
        break;
      default:
        return null;
    }
  };
  // Renderiza opciones específicas del header si el título coincide
  const renderOptions = () => (
    <Block row style={styles.options}>
      <Button
        shadowless
        style={[styles.tab, styles.divider]}
        onPress={() => navigation.navigate("Pro")}
      >
        <Block row middle>
          <Icon
            name="diamond"
            family="ArgonExtra"
            style={{ paddingRight: 8 }}
            color={argonTheme.COLORS.ICON}
          />
          <Text size={16} style={styles.tabTitle}>
            {optionLeft || "Beauty"}
          </Text>
        </Block>
      </Button>
      <Button
        shadowless
        style={styles.tab}
        onPress={() => navigation.navigate("Pro")}
      >
        <Block row middle>
          <Icon
            size={16}
            name="bag-17"
            family="ArgonExtra"
            style={{ paddingRight: 8 }}
            color={argonTheme.COLORS.ICON}
          />
          <Text size={16} style={styles.tabTitle}>
            {optionRight || "Fashion"}
          </Text>
        </Block>
      </Button>
    </Block>
  );

  // Renderiza las pestañas si se pasan
  const renderTabs = () => {
    if (!tabs) return null;

    const defaultTab = tabs[0]?.id;

    return (
      <Tabs
        data={tabs}
        initialIndex={tabIndex || defaultTab}
        onChange={(id) => navigation.setParams({ tabId: id })}
      />
    );
  };

  // Renderiza el contenido del header
  const renderHeader = () => (
    <Block center>
      {optionLeft || optionRight ? renderOptions() : null}
      {tabs ? renderTabs() : null}
    </Block>
  );
  // Define estilos para el header
  const noShadow = ["Search", "Categories", "Deals", "Pro", "Profile"].includes(
    title,
  );
  const headerStyles = [
    !noShadow ? styles.shadow : null,
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
  ];

  const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor }];

  return (
    <Block style={headerStyles}>
      <NavBar
        back={false}
        title={title}
        style={navbarStyles}
        transparent={transparent}
        right={renderRight()}
        rightStyle={{ alignItems: "center" }}
        left={
          <Icon
            name={back ? "chevron-left" : "menu"}
            family="entypo"
            size={20}
            onPress={handleLeftPress}
            color={
              iconColor ||
              (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)
            }
            style={{ marginTop: 2 }}
          />
        }
        leftStyle={{ paddingVertical: 12, flex: 0.2 }}
        titleStyle={[
          styles.title,
          { color: argonTheme.COLORS[white ? "WHITE" : "HEADER"] },
          titleColor && { color: titleColor },
        ]}
        {...props}
      />
      {renderHeader()}
    </Block>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: "relative",
  },
  title: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX() ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
    // Añadido boxShadow para compatibilidad web
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: "absolute",
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER,
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
    // Añadido boxShadow para compatibilidad web
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: "400",
    color: argonTheme.COLORS.HEADER,
  },
});

export default Header;
