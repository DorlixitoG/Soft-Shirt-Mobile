import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  Image,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import Icon from "react-native-vector-icons/FontAwesome";

// Pantalla de Ventas (Pedidos)

const VentasScreen = () => {
  // URLs de la API
  const pedidosUrl = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos";
  const clientesUrl =
    "https://softshirt-1c3fad7d72e8.herokuapp.com/api/clientes";
  const insumosUrl = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/insumos";
  const estadosPedidosUrl =
    "https://softshirt-1c3fad7d72e8.herokuapp.com/api/estadosPedidos";

  const productoUrl =
    "https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos";
  // Estados
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState({});
  const [insumos, setInsumos] = useState({});
  const [productos, setProductos] = useState({});
  const [estadosPedidos, setEstadosPedidos] = useState({});
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [comprobanteVisible, setComprobanteVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [comprobanteImageUri, setComprobanteImageUri] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Efecto para obtener datos al montar el componente
  useEffect(() => {
    getPedidos();
    getClientes();
    getInsumos();
    getEstadosPedidos();
    getProductos();
  }, []);

  // Obtener pedidos desde la API
  const getPedidos = async () => {
    try {
      const respuesta = await axios.get(pedidosUrl);
      // setPedidos(respuesta.data);

      const ventas = respuesta.data.filter(
        (venta) => venta.IdEstadoPedido === 3,
      );

      setPedidos(ventas);
    } catch (error) {
      setShowAlert(true);
    }
  };

  // Obtener clientes desde la API
  const getClientes = async () => {
    try {
      const respuesta = await axios.get(clientesUrl);
      const clientesMap = respuesta.data.reduce((acc, cliente) => {
        acc[cliente.IdCliente] = cliente.NombreApellido;
        return acc;
      }, {});
      setClientes(clientesMap);
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

  const getProductos = async () => {
    try {
      const respuesta = await axios.get(productoUrl);
      const productosMap = respuesta.data.reduce((acc, producto) => {
        acc[producto.IdProducto] = producto.Referencia; // Usar Referencia en lugar de NombreProducto
        return acc;
      }, {});
      setProductos(productosMap);
    } catch (error) {
      setShowAlert(true);
    }
  };

  // Obtener estados de pedidos desde la API
  const getEstadosPedidos = async () => {
    try {
      const respuesta = await axios.get(estadosPedidosUrl);
      const estadosMap = respuesta.data.reduce((acc, estado) => {
        acc[estado.IdEstadoPedido] = estado.NombreEstado;
        return acc;
      }, {});
      setEstadosPedidos(estadosMap);
    } catch (error) {
      setShowAlert(true);
    }
  };

  // Manejar el detalle de un pedido seleccionado
  const handleDetallePedido = async (IdPedido) => {
    try {
      const respuesta = await axios.get(`${pedidosUrl}/${IdPedido}`);
      const pedido = respuesta.data;
      setPedidoSeleccionado(pedido);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await getPedidos();
    setRefreshing(false);
  };

  // Filtrar pedidos según término de búsqueda
  // Filtrar pedidos según término de búsqueda
  const filterPedidos = (pedido) => {
    const cliente = clientes[pedido.IdCliente] || "";
    const fecha = pedido.Fecha;
    const total = formatPrice(pedido.Total);
    const tipoPago = pedido.TipoPago || "";
    const estadoPedido = estadosPedidos[pedido.IdEstadoPedido] || "";

    const searchTermLower = searchTerm.toLowerCase();
    const formattedSearchTerm = searchTermLower.includes("/")
      ? convertDateFormat(searchTermLower)
      : searchTermLower;

    return (
      cliente.toLowerCase().includes(searchTermLower) ||
      fecha.includes(formattedSearchTerm) ||
      total.toLowerCase().includes(searchTermLower) ||
      tipoPago.toLowerCase().includes(searchTermLower) ||
      estadoPedido.toLowerCase().includes(searchTermLower)
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
          <Text>Cliente: {clientes[item.IdCliente] || "Desconocido"}</Text>
          <Text>Método de pago: {item.TipoPago}</Text>
          <Text>Fecha: {item.Fecha}</Text>
          <Text>Total: {formatPrice(item.Total)}</Text>
          <Text>
            Estado: {estadosPedidos[item.IdEstadoPedido] || "Desconocido"}
          </Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => handleDetallePedido(item.IdPedido)}
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
        data={pedidos.filter(filterPedidos)}
        keyExtractor={(item) => item.IdPedido.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          {pedidoSeleccionado && (
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <View style={styles.detailContainer}>
                <Text style={styles.detailHeaderText}>Cliente:</Text>
                <Text style={styles.detailText}>
                  {clientes[pedidoSeleccionado.IdCliente] || "Desconocido"}
                </Text>
                <Text style={styles.detailHeaderText}>Método de pago:</Text>
                <Text style={styles.detailText}>
                  {pedidoSeleccionado.TipoPago || "Desconocido"}
                </Text>
                <Text style={styles.detailHeaderText}>Fecha:</Text>
                <Text style={styles.detailText}>
                  {new Date(pedidoSeleccionado.Fecha).toLocaleDateString()}
                </Text>

                <Text style={styles.detailHeaderText}>Estado:</Text>
                <Text style={styles.detailText}>
                  {estadosPedidos[pedidoSeleccionado.IdEstadoPedido] ||
                    "Desconocido"}
                </Text>

                <FlatList
                  data={pedidoSeleccionado.DetallesPedidosProductos}
                  keyExtractor={(item) =>
                    item.IdDetallePedidoProducto.toString()
                  }
                  renderItem={({ item }) => (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailItem}>
                        {productos[item.IdProducto] || "Desconocido"}{" "}
                        {/* Mostrar la referencia del producto */}
                      </Text>
                      <Text style={styles.detailItem}>{item.Cantidad}</Text>
                      <Text style={styles.detailItem}>
                        {formatPrice(item.Precio)}
                      </Text>
                      <Text style={styles.detailItem}>
                        {formatPrice(item.SubTotal)}
                      </Text>
                    </View>
                  )}
                  ListHeaderComponent={() => (
                    <View style={styles.headerRow}>
                      <Text style={styles.headerItem}>Producto</Text>
                      <Text style={styles.headerItem}>Cantidad</Text>
                      <Text style={styles.headerItem}>Precio</Text>
                      <Text style={styles.headerItem}>Total</Text>
                    </View>
                  )}
                />

                {/* Botón para desplegar el comprobante y comprobante */}
                {pedidoSeleccionado.TipoPago === "Transferencia" && (
                  <>
                    <Pressable
                      style={styles.toggleButton}
                      onPress={() => setComprobanteVisible(!comprobanteVisible)}
                    >
                      <Text style={styles.toggleButtonText}>
                        {comprobanteVisible
                          ? "Ocultar comprobante"
                          : "Mostrar comprobante"}
                      </Text>
                    </Pressable>

                    {/* Mostrar el campo de imagen solo si está visible */}
                    {comprobanteVisible && (
                      <View style={styles.comprobanteContainer}>
                        <Pressable
                          onPress={() => {
                            setComprobanteImageUri(
                              pedidoSeleccionado.ImagenComprobante,
                            );
                            setImageModalVisible(true);
                          }}
                        >
                          <Image
                            source={{
                              uri: pedidoSeleccionado.ImagenComprobante,
                            }}
                            style={styles.comprobanteImage}
                          />
                        </Pressable>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      </Modal>
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalBackground}>
          <Pressable
            style={styles.imageModalContainer}
            onPress={() => setImageModalVisible(false)}
          >
            <Image
              source={{ uri: comprobanteImageUri }}
              style={styles.fullSizeImage}
            />
          </Pressable>
        </View>
      </Modal>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Error"
        message="Hubo un problema al obtener los datos"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Cerrar"
        confirmButtonColor="#01c05f"
        onConfirmPressed={() => setShowAlert(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Fondo gris claro
  },
  itemContainer: {
    backgroundColor: "#fff", // Fondo blanco para la cajita
    padding: 15, // Borde redondeado
    marginBottom: 8, // Espacio entre los ítems
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
    borderRadius: 30,
    width: 30, // Aumenta el ancho
    height: 30, // Aumenta la altura
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Asegura que el botón esté por encima de otros elementos
  },
  closeButtonText: {
    color: "white",
    fontSize: 12, // Aumenta el tamaño de fuente si es necesario
    fontWeight: "bold",
    textAlign: "center",
  },
  detailContainer: {
    marginBottom: 20,
  },
  detailHeaderText: {
    fontWeight: "bold",
  },
  detailText: {
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerItem: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailItem: {
    flex: 1,
    textAlign: "center",
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  searchInput: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  toggleButton: {
    backgroundColor: "#4bc1d2",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  comprobanteContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  comprobanteImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
  imagemodalbackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "",
  },
  imageModalContainer: {
    width: "100%",
    padding: 5,
  },
  fullSizeImage: {
    width: "100%",
    height: 800,
    resizeMode: "contain",
  },
});

export default VentasScreen;
