import React from "react";
import * as Font from "expo-font";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { Icon } from "galio-framework";

// Configuración del conjunto de íconos personalizados en formato JSON
import softshirtConfig from "../assets/config/softshirt.json";

// Fuente personalizada para los íconos
const SoftExtra = require("../assets/font/softshirt.ttf");

// Crea un conjunto de íconos a partir del archivo de configuración IcoMoon
const IconArgonExtra = createIconSetFromIcoMoon(softshirtConfig, "SoftExtra");

class IconExtra extends React.Component {
  state = {
    fontLoaded: false, // Estado para verificar si la fuente se ha cargado
  };

  // Carga la fuente personalizada de forma asíncrona al montar el componente
  async componentDidMount() {
    await Font.loadAsync({ SoftExtra: SoftExtra });
    this.setState({ fontLoaded: true }); // Actualiza el estado cuando la fuente esté cargada
  }

  render() {
    const { name, family, size = 20, color = "#000", ...rest } = this.props;

    // Renderiza el ícono si el nombre, la familia y la fuente están cargados
    if (name && family && this.state.fontLoaded) {
      // Usa el conjunto de íconos personalizado si la familia es "SoftExtra"
      if (family === "SoftExtra") {
        return (
          <IconArgonExtra
            name={name}
            family={family}
            size={size}
            color={color}
            {...rest} // Pasa cualquier otra prop adicional
          />
        );
      }
      // Usa el ícono estándar de Galio Framework para otras familias
      return (
        <Icon name={name} family={family} size={size} color={color} {...rest} />
      );
    }

    // No renderiza nada si la fuente no está cargada o si falta nombre o familia
    return null;
  }
}

export default IconExtra;
