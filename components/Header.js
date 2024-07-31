// import React from "react";
import { StyleSheet, Platform, Dimensions } from "react-native";
// import { Button, Block, NavBar, Text, theme } from "galio-framework";
import { useNavigation } from "@react-navigation/native";
// import Icon from "./Icon";
// import Tabs from "./Tabs";
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
  // const handleLeftPress = () => {
  //   return back ? navigation.goBack() : navigation.openDrawer();
  // };

  // // Renderiza opciones específicas del header si el título coincide
  // const renderRight = () => {
  //   switch (title) {
  //     case "Home":
  //     case "Compras":
  //     case "Profile":
  //     case "Search":
  //     case "Settings":
  //       // Aquí puedes añadir opciones específicas si es necesario
  //       break;
  //     default:
  //       return null;
  //   }
  // };
  // Renderiza opciones específicas del header si el título coincide
  // const renderOptions = () => (
  // );

  // Renderiza las pestañas si se pasan
  // const renderTabs = () => {
  //   if (!tabs) return null;

  //   const defaultTab = tabs[0]?.id;

  //   return (
  //     <Tabs
  //       data={tabs}
  //       initialIndex={tabIndex || defaultTab}
  //       onChange={(id) => navigation.setParams({ tabId: id })}
  //     />
  //   );
  // };

  // Renderiza el contenido del header
  // const renderHeader = () => (
  //   <Block center>
  //     {optionLeft || optionRight ? renderOptions() : null}
  //     {tabs ? renderTabs() : null}
  //   </Block>
  // );
  // Define estilos para el header
  // const noShadow = ["Search", "Categories", "Deals", "Pro", "Profile"].includes(
  //   title,
  // );
  // const headerStyles = [
  //   !noShadow ? styles.shadow : null,
  //   transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
  // ];

  // const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor }];
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

  tabTitle: {
    lineHeight: 19,
    fontWeight: "400",
    color: argonTheme.COLORS.HEADER,
  },
});

export default Header;
