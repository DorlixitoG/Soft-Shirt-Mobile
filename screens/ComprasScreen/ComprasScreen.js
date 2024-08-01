import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import Icon from "react-native-vector-icons/FontAwesome";

// Pantalla de Compras

const ComprasScreen = () => {
  // URLs de la API
  const comprasUrl = "https://prueba-despliegue-back.onrender.com/api/compras";
  const proveedoresUrl =
    "https://prueba-despliegue-back.onrender.com/api/proveedores";
  const insumosUrl = "https://prueba-despliegue-back.onrender.com/api/insumos";

  // Estados
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState({});
  const [insumos, setInsumos] = useState({});
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Efecto para obtener datos al montar el componente
  useEffect(() => {
    getCompras();
    getProveedores();
    getInsumos();
  }, []);

  // Obtener compras desde la API
  const getCompras = async () => {
    try {
      const respuesta = await axios.get(comprasUrl);
      const comprasOrdenadas = respuesta.data.sort(
        (a, b) => new Date(b.Fecha) - new Date(a.Fecha),
      );
      setCompras(comprasOrdenadas);
    } catch (error) {
      setShowAlert(true);
    }
  };

  // Obtener proveedores desde la API
  const getProveedores = async () => {
    try {
      const respuesta = await axios.get(proveedoresUrl);
      const proveedoresMap = respuesta.data.reduce((acc, proveedor) => {
        acc[proveedor.IdProveedor] = proveedor.NombreApellido;
        return acc;
      }, {});
      setProveedores(proveedoresMap);
    } catch (error) {
      setShowAlert(true);
    }
  };

  // Obtener insumos desde la API
  const getInsumos = async () => {
    try {
      const respuesta = await axios.get(insumosUrl);
      const insumosMap = respuesta.data.reduce((acc, insumo) => {
        acc[insumo.IdInsumo] = insumo.Referencia;
        return acc;
      }, {});
      setInsumos(insumosMap);
    } catch (error) {
      setShowAlert(true);
    }
  };

  // Manejar el detalle de una compra seleccionada
  const handleDetalleCompra = async (IdCompra) => {
    try {
      const respuesta = await axios.get(`${comprasUrl}/${IdCompra}`);
      const compra = respuesta.data;
      setCompraSeleccionada(compra);
      setModalVisible(true);
    } catch (error) {
      setShowAlert(true);
    }
  };

  // Convertir formato de fecha
  const convertDateFormat = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Filtrar compras según término de búsqueda
  const filterCompras = (compra) => {
    const proveedor = proveedores[compra.IdProveedor] || "";
    const fecha = compra.Fecha;
    const total = formatPrice(compra.Total);
    const searchTermLower = searchTerm.toLowerCase();
    const formattedSearchTerm = searchTermLower.includes("/")
      ? convertDateFormat(searchTermLower)
      : searchTermLower;

    return (
      proveedor.toLowerCase().includes(searchTermLower) ||
      fecha.includes(formattedSearchTerm) ||
      total.toLowerCase().includes(searchTermLower)
    );
  };

  // Formatear precios
  const formatPrice = (price) => {
    const formattedPrice = parseFloat(price).toLocaleString("es-ES", {
      style: "decimal",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return `$${formattedPrice} COP`;
  };

  // Renderizar un ítem de la lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text>
            Proveedor: {proveedores[item.IdProveedor] || "Desconocido"}
          </Text>
          <Text>Fecha: {item.Fecha}</Text>
          <Text>Total: {formatPrice(item.Total)}</Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => handleDetalleCompra(item.IdCompra)}
        >
          <Icon name="info-circle" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      <FlatList
        data={compras.filter(filterCompras)}
        keyExtractor={(item) => item.IdCompra.toString()}
        renderItem={renderItem}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          {compraSeleccionada && (
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <View style={styles.detailContainer}>
                <Text style={styles.detailHeaderText}>Proveedor:</Text>
                <Text style={styles.detailText}>
                  {proveedores[compraSeleccionada.IdProveedor] || "Desconocido"}
                </Text>
                <Text style={styles.detailHeaderText}>Fecha:</Text>
                <Text style={styles.detailText}>
                  {new Date(compraSeleccionada.Fecha).toLocaleDateString()}
                </Text>
                <Text style={styles.detailHeaderText}>Total:</Text>
                <Text style={styles.detailText}>
                  {formatPrice(compraSeleccionada.Total)}
                </Text>
              </View>

              <FlatList
                data={compraSeleccionada.DetallesCompras}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailItem}>
                      {insumos[item.IdInsumo] || "Desconocido"}
                    </Text>
                    <Text style={styles.detailItem}>{item.Cantidad}</Text>
                    <Text style={styles.detailItem}>
                      {formatPrice(item.Precio)}
                    </Text>
                    <Text style={styles.detailItem}>
                      {formatPrice(item.Cantidad * item.Precio)}
                    </Text>
                  </View>
                )}
                ListHeaderComponent={() => (
                  <View style={styles.headerRow}>
                    <Text style={styles.headerText}>Insumo</Text>
                    <Text style={styles.headerText}>Cantidad</Text>
                    <Text style={styles.headerText}>Precio</Text>
                    <Text style={styles.headerText}>SubTotal</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </Modal>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Error"
        message="Hubo un problema al obtener los datos"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: "#4bc1d2",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#01c05f",
    padding: 5,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailContainer: {
    marginBottom: 20,
  },
  detailHeaderText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailText: {
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  detailItem: {
    flex: 1,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
});

export default ComprasScreen;
