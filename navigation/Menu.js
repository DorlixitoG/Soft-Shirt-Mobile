import { theme } from "galio-framework";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Importa el ícono de FontAwesome
import { DrawerItem as DrawerCustomItem } from "../components";
import Images from "../constants/Images";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CustomDrawerContent({
  drawerPosition = "left",
  navigation,
  profile,
  focused = false,
  state,
  ...rest
}) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("Usuario");
        if (storedUserName) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
      }
    };

    getUserName();
  }, []);

  const screens = ["Productos", "Compras"];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("Usuario");
      navigation.reset({
        index: 0,
        routes: [{ name: "SignIn" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container} {...rest}>
      <View style={styles.userContainer}>
        <Icon name="user" size={30} color="#fff" style={styles.userIcon} />
        <Text style={styles.userName}>Administrador {userName}</Text>
      </View>
      <View style={styles.header}>
        <Image style={styles.logo} source={Images.Logo} />
      </View>
      <View style={styles.menuContainer}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => (
            <DrawerCustomItem
              title={item}
              key={index}
              navigation={navigation}
              focused={state.index === index ? true : false}
            />
          ))}
        </ScrollView>
        <View style={styles.logoutContainer}>
          <DrawerCustomItem title="Cerrar sesión" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE, // Reducido el paddingTop para acercar el logo al contenedor del usuario
    flexDirection: "column",
    alignItems: "center", // Centra el logo
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center", // Reducido el marginBottom para acercar el contenedor de usuario al logo
    backgroundColor: "#01c05f", // Color verde de fondo
    padding: 20, // Espaciado interno
    width: "100%", // Ocupa todo el ancho disponible
    justifyContent: "flex-start", // Alinea los elementos al inicio (izquierda)
  },
  userIcon: {
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // Color del texto blanco para contraste
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginVertical: 10, // Añadido un margen vertical para el logo
  },
  menuContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start", // Cambiado a flex-start para evitar espacio extra al final
  },
  logoutContainer: {
    padding: 16,
  },
});

export default CustomDrawerContent;
