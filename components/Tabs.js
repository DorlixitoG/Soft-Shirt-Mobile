import React from "react";
import { StyleSheet, Dimensions, FlatList, Animated } from "react-native";
import { Block, theme } from "galio-framework";
import argonTheme from "../constants/Theme";

// Obtiene el ancho de la pantalla para ajustar el estilo de las pestañas
const { width } = Dimensions.get("screen");

// Datos predeterminados para las pestañas
const defaultMenu = [
  { id: "popular", title: "Popular" },
  { id: "beauty", title: "Beauty" },
  { id: "cars", title: "Cars" },
  { id: "motocycles", title: "Motocycles" },
];

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null, // Estado para la pestaña activa
    };
    this.menuRef = React.createRef(); // Referencia para el FlatList
    this.animatedValue = new Animated.Value(1); // Valor animado para el cambio de color
  }

  // Actualiza el estado activo basado en las props iniciales
  static getDerivedStateFromProps(nextProps) {
    const { initialIndex = null } = nextProps;
    if (initialIndex !== null) {
      return { active: initialIndex };
    }
    return null;
  }

  // Selecciona una pestaña al montar el componente
  componentDidMount() {
    const { initialIndex } = this.props;
    initialIndex && this.selectMenu(initialIndex);
  }

  // Función para animar el cambio de color
  animate() {
    this.animatedValue.setValue(0); // Resetea el valor animado

    Animated.timing(this.animatedValue, {
      toValue: 1, // Valor final de la animación
      duration: 300, // Duración de la animación en ms
      useNativeDriver: false, // Color no soportado por el driver nativo
    }).start();
  }

  // Maneja el fallo al intentar desplazar al índice
  onScrollToIndexFailed = () => {
    this.menuRef.current.scrollToIndex({
      index: 0, // Desplaza al primer índice
      viewPosition: 0.5, // Posición de la vista en el centro
    });
  };

  // Selecciona una pestaña y realiza la animación
  selectMenu = (id) => {
    this.setState({ active: id }); // Actualiza el estado de la pestaña activa

    this.menuRef.current.scrollToIndex({
      index: this.props.data.findIndex((item) => item.id === id), // Encuentra el índice de la pestaña seleccionada
      viewPosition: 0.5, // Posición de la vista en el centro
    });

    this.animate(); // Inicia la animación
    this.props.onChange && this.props.onChange(id); // Llama a la función de cambio de pestaña, si está definida
  };

  // Renderiza un elemento de pestaña
  renderItem = (item) => {
    const isActive = this.state.active === item.id; // Verifica si la pestaña es activa

    // Interpola el color del texto basado en el valor animado
    const textColor = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        argonTheme.COLORS.BLACK,
        isActive ? argonTheme.COLORS.WHITE : argonTheme.COLORS.BLACK,
      ],
      extrapolate: "clamp",
    });

    // Estilos del contenedor de la pestaña
    const containerStyles = [
      styles.titleContainer,
      !isActive && { backgroundColor: argonTheme.COLORS.SECONDARY },
      isActive && styles.containerShadow,
    ];

    return (
      <Block style={containerStyles}>
        <Animated.Text
          style={[styles.menuTitle, { color: textColor }]} // Aplica el color interpolado
          onPress={() => this.selectMenu(item.id)} // Maneja la selección de la pestaña
        >
          {item.title}
        </Animated.Text>
      </Block>
    );
  };

  // Renderiza la lista de pestañas
  renderMenu = () => {
    const { data = defaultMenu, ...props } = this.props; // Usa datos predeterminados si no se pasan datos

    return (
      <FlatList
        {...props}
        data={data}
        horizontal={true} // Desplazamiento horizontal
        ref={this.menuRef} // Referencia al FlatList
        extraData={this.state} // Fuerza la actualización cuando cambia el estado
        keyExtractor={(item) => item.id} // Clave única para cada elemento
        showsHorizontalScrollIndicator={false} // Oculta el indicador de desplazamiento horizontal
        onScrollToIndexFailed={this.onScrollToIndexFailed} // Maneja el fallo al intentar desplazar al índice
        renderItem={({ item }) => this.renderItem(item)} // Renderiza cada elemento de la lista
        contentContainerStyle={styles.menu} // Estilos del contenedor del contenido
      />
    );
  };

  // Renderiza el componente principal
  render() {
    return <Block style={styles.container}>{this.renderMenu()}</Block>;
  }
}

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    width: width, // Ancho completo de la pantalla
    backgroundColor: theme.COLORS.WHITE, // Color de fondo blanco
    zIndex: 2, // Coloca el componente por encima de otros
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  menu: {
    paddingHorizontal: theme.SIZES.BASE * 2.5,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4,
    marginRight: 9,
  },
  containerShadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 1,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  menuTitle: {
    fontWeight: "600",
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: argonTheme.COLORS.MUTED,
  },
});
