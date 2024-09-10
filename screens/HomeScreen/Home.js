import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Switch,
  RefreshControl,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import AwesomeAlert from "react-native-awesome-alerts";
import LogoutConfirmation from "../../components/LogoutConfirmation";
import { useFocusEffect } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const url = "https://back-end1-9e2f0d364f68.herokuapp.com/api/insumos";

  // Estados para manejar datos y UI

  const [Insumos, setInsumos] = useState([]);
  const [Disenios, setDisenios] = useState([]);
  const [Colores, setColores] = useState([]);
  const [Tallas, setTallas] = useState([]);
  const [IdInsumo, setIdInsumo] = useState("");
  const [IdColor, setIdColor] = useState("");
  const [IdTalla, setIdTalla] = useState("");
  const [Referencia, setReferencia] = useState("");
  const [Cantidad, setCantidad] = useState("");
  const [ValorCompra, setValorCompra] = useState("");
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [operation, setOperation] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [placeholderCantidad, setPlaceholderCantidad] = useState("Cantidad"); // Valor por defecto para el placeholder

  // Efecto para obtener datos al cargar el componente

  useFocusEffect(
    React.useCallback(() => {
      getInsumos();
      getColores();
      getTallas();
    }, []),
  );
  // Funciones para obtener datos desde la API

  const getInsumos = async () => {
    try {
      const respuesta = await axios.get(url);
      setInsumos(respuesta.data);
      console.log(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
    }
  };

  const getDisenios = async () => {
    try {
      const respuesta = await axios.get(
        "https://back-end1-9e2f0d364f68.herokuapp.com/api/disenios",
      );
      const DiseniosActivos = respuesta.data.filter(
        (disenio) => disenio.Estado === "Activo",
      );
      console.log(DiseniosActivos);
      setDisenios(DiseniosActivos);
    } catch (error) {
      console.error("Error al obtener los diseños:", error);
    }
  };

  const getColores = async () => {
    try {
      const respuesta = await axios.get(
        "https://back-end1-9e2f0d364f68.herokuapp.com/api/colores",
      );
      const coloresActivos = respuesta.data.filter(
        (color) => color.Estado === "Activo",
      );
      setColores(coloresActivos);
    } catch (error) {
      console.error("Error al obtener los colores:", error);
    }
  };

  const getTallas = async () => {
    try {
      const respuesta = await axios.get(
        "https://back-end1-9e2f0d364f68.herokuapp.com/api/tallas",
      );
      const tallasActivas = respuesta.data.filter(
        (talla) => talla.Estado === "Activo",
      );
      setTallas(tallasActivas);
    } catch (error) {
      console.error("Error al obtener las tallas:", error);
    }
  };

  const openModal = (op, insumo = {}) => {
    if (insumo.Estado === "Inactivo") return; // Evitar abrir el modal si el producto está inactivo
    setIdInsumo(insumo.IdInsumo || "");
    setIdColor(insumo.IdColor || "");
    setIdTalla(insumo.IdTalla || "");
    setReferencia(insumo.Referencia || "");
    setCantidad("0"); // Establece Cantidad en 0
    setValorCompra("0"); // Establece ValorVenta en 0

    setTitle(op === 1 ? "Registrar Producto" : "Editar Producto");
    setOperation(op);
    setPlaceholderCantidad("Cantidad");
    setAlertMessage("");
    setModalVisible(true);
  };

  // Funciones de validación

  // Función para validar la referencia
  const validateReferencia = (value) => {
    if (!value) {
      return "Escribe la referencia";
    }
    // Validar que la referencia siga el patrón TST-001
    // if (!/^[A-Z]{3}-\d{3}$/.test(value)) {
    //   return "La referencia debe ser en el formato AAA-000";
    // }
    // return "";
  };
  // Funciones para cambiar el estado y la publicación del producto

  const cambiarEstado = async (IdInsumo) => {
    try {
      const insumoActual = Insumos.find(
        (insumo) => insumo.IdInsumo === IdInsumo,
      );
      // Validar si la cantidad es mayor que 0
      if (insumoActual.Cantidad > 0) {
        setAlertTitle("Advertencia");
        setAlertMessage(
          "No se puede cambiar el estado porque la cantidad es mayor que 0.",
        );
        setAlertVisible(true);
        return; // Detiene la ejecución si la cantidad es mayor a 0
      }
      const nuevoEstadoInsumo =
        insumoActual.Estado === "Activo" ? "Inactivo" : "Activo";

      const parametrosProducto = {
        IdInsumo: IdInsumo,
        IdColor: insumoActual.IdColor,
        IdTalla: insumoActual.IdTalla,
        Referencia: insumoActual.Referencia,
        Cantidad: insumoActual.Cantidad,
        ValorCompra: insumoActual.ValorCompra,
        Estado: nuevoEstadoInsumo,
      };

      console.log(
        "Enviando parámetros para cambiar estado:",
        parametrosProducto,
      );

      const response = await axios.put(
        `${url}/${IdInsumo}`,
        parametrosProducto,
      );

      console.log("Respuesta del backend para cambiar estado:", response.data);

      if (response.status === 200) {
        setInsumos((prevInsumos) =>
          prevInsumos.map((insumo) =>
            insumo.IdInsumo === IdInsumo
              ? {
                  ...insumo,
                  Estado: nuevoEstadoInsumo,
                }
              : insumo,
          ),
        );
        setAlertTitle("Éxito");
        setAlertMessage("Estado cambiado con éxito");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error(
        "Error al cambiar estado y publicación:",
        error.response?.data,
      );
      setAlertTitle("Error");
      setAlertMessage("Error al cambiar el estado");
      setAlertVisible(true);
    }
  };

  const validar = () => {
    // Validar referencia
    const referenciaError = validateReferencia(Referencia);
    if (referenciaError) {
      setAlertTitle("Advertencia");
      setAlertMessage(referenciaError);
      setAlertVisible(true);
      return;
    }
    const referenciaDuplicada = Insumos.some(
      (insumo) =>
        insumo.Referencia === Referencia && insumo.IdInsumo !== IdInsumo,
    );

    if (referenciaDuplicada) {
      setAlertTitle("Error");
      setAlertMessage(
        "Ya existe un insumo con esta referencia, intenta de nuevo con otra",
      );
      setAlertVisible(true);
      return; // Detener el proceso si se encuentra una referencia duplicada
    }

    const parametros = {
      IdColor,
      IdTalla,
      Referencia: Referencia.trim(),
      Cantidad: parseInt(Cantidad, 10),
      ValorCompra: parseFloat(ValorCompra),
      IdInsumo, // Incluye IdInsumo para PUT
    };

    // Establece el método según la operación (1 = crear, 2 = editar)
    const metodo = operation === 1 ? "POST" : "PUT";
    enviarSolicitud(metodo, parametros);
  };

  // Función para enviar solicitudes a la API

  const enviarSolicitud = async (metodo, parametros) => {
    try {
      setLoading(true);
      if (metodo === "PUT") {
        // Para editar un insumo
        console.log("Enviando parámetros para PUT:", parametros);
        await axios.put(`${url}/${parametros.IdInsumo}`, parametros);
        setAlertTitle("Éxito");
        setAlertMessage("Insumo editado exitosamente");
      } else if (metodo === "POST") {
        // Para crear un nuevo insumo
        console.log("Enviando parámetros para POST:", parametros);
        await axios.post(url, parametros);
        setAlertTitle("Éxito");
        setAlertMessage("Insumo creado exitosamente");
      } else if (metodo === "DELETE") {
        // Para eliminar un insumo
        console.log("Enviando parámetros para DELETE:", parametros);
        await axios.delete(`${url}/${parametros.IdInsumo}`);
        setAlertTitle("Éxito");
        setAlertMessage("Insumo eliminado exitosamente");
      }
      getInsumos(); // Obtén los insumos actualizados
      setModalVisible(false); // Cierra el modal
    } catch (error) {
      console.error("Error al enviar solicitud:", error.response?.data);
      setAlertTitle("Error");
      setAlertMessage(error.response?.data?.message || "Error en la solicitud");
    } finally {
      setLoading(false);
      setAlertVisible(true); // Muestra la alerta
    }
  };

  const confirmDelete = (IdInsumo) => {
    setDeleteId(IdInsumo);
    setConfirmDeleteVisible(true);
  };

  const deleteTalla = () => {
    if (deleteId !== null) {
      enviarSolicitud("DELETE", { IdInsumo: deleteId });
      setConfirmDeleteVisible(false);
      setDeleteId(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getInsumos();
    setRefreshing(false);
  };
  const updateReferencia = (colorId, tallaId) => {
    const color = Colores.find((color) => color.IdColor === parseInt(colorId));
    const talla = Tallas.find((talla) => talla.IdTalla === parseInt(tallaId));
    if (color && talla) {
      const colorHex = color.Referencia.substring(1, 4).toUpperCase();
      const referenciaGenerada = `${talla.Talla}-${colorHex}`;
      setReferencia(referenciaGenerada);
    } else {
      setReferencia("");
    }
  };

  const handleChangeIdColor = (value) => {
    setIdColor(value);

    updateReferencia(value, IdTalla); // Llama a updateReferencia al cambiar el color
  };

  const handleChangeIdTalla = (value) => {
    setIdTalla(value);
    updateReferencia(IdColor, value); // Llama a updateReferencia al cambiar la talla
  };

  const filteredItems = Insumos.filter((producto) => {
    const color = Colores.find((c) => c.IdColor === producto.IdColor);
    const talla = Tallas.find((t) => t.IdTalla === producto.IdTalla);

    return (
      producto.Referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.Cantidad.toString().includes(searchTerm) ||
      producto.ValorCompra.toString().includes(searchTerm) ||
      producto.Estado.toString().includes(searchTerm) ||
      color.Color.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      talla.Talla.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatPrice = (price) => {
    const formattedPrice = parseFloat(price).toLocaleString("es-ES", {
      style: "decimal",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return `$${formattedPrice} COP`;
  };

  // Renderizado de cada insumos en la lista

  const renderItem = ({ item }) => {
    const color = Colores.find((c) => c.IdColor === item.IdColor);
    const talla = Tallas.find((t) => t.IdTalla === item.IdTalla);
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Referencia: {item.Referencia}</Text>
            <Text style={styles.itemText}>
              Color: {color ? color.Color : "No disponible"}
            </Text>
            <Text style={styles.itemText}>
              Talla: {talla ? talla.Talla : "No disponible"}
            </Text>
            <Text style={styles.itemText}>Cantidad: {item.Cantidad}</Text>
            <Text style={styles.itemText}>
              Valor Compra: {formatPrice(item.ValorCompra)}
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Pressable
              style={[
                styles.editButton,
                { opacity: item.Estado === "Inactivo" ? 0.5 : 1 },
              ]}
              onPress={() => item.Estado !== "Inactivo" && openModal(2, item)} // `2` para edición
              disabled={item.Estado === "Inactivo"}
            >
              <Icon name="pencil" size={20} color="#fff" />
            </Pressable>
            {/* Solo mostrar el botón de eliminar si la cantidad es 0 */}
            {item.Cantidad === 0 && (
              <Pressable
                onPress={() =>
                  item.Estado !== "Inactivo" && confirmDelete(item.IdInsumo)
                }
                style={[
                  styles.deleteButton,
                  { opacity: item.Estado === "Inactivo" ? 0.5 : 1 },
                ]}
                disabled={item.Estado === "Inactivo"}
              >
                <Icon name="trash" size={20} color="#fff" />
              </Pressable>
            )}

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Estado</Text>
              <Switch
                value={item.Estado === "Activo"}
                onValueChange={() => cambiarEstado(item.IdInsumo)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
        <Pressable style={styles.createButton} onPress={() => openModal(1)}>
          <Icon name="plus" size={20} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.IdInsumo.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={IdColor}
                onValueChange={handleChangeIdColor}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un color" value="" />
                {Colores.map((color) => (
                  <Picker.Item
                    key={color.IdColor}
                    label={color.Color}
                    value={color.IdColor}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={IdTalla}
                onValueChange={handleChangeIdTalla}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una talla" value="" />
                {Tallas.map((talla) => (
                  <Picker.Item
                    key={talla.IdTalla}
                    label={talla.Talla}
                    value={talla.IdTalla}
                  />
                ))}
              </Picker>
            </View>

            <TextInput
              placeholder="Referencia"
              value={Referencia}
              onChangeText={setReferencia}
              style={styles.input}
              maxLength={7} // Limitar la longitud del texto a 7 caracteres
              editable={false} // Deshabilitado siempre
            />
            <TextInput
              style={styles.input}
              placeholder={placeholderCantidad}
              value={Cantidad}
              onChangeText={setCantidad}
              keyboardType="numeric"
              editable={false} // Deshabilitado siempre
            />

            <TextInput
              placeholder="Valor de compra"
              value={ValorCompra}
              onChangeText={(text) =>
                setValorCompra(text.replace(/[^0-9.]/g, ""))
              } // Permitir solo números y decimales
              style={styles.input}
              keyboardType="numeric"
              editable={false} // Deshabilitado siempre
            />

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.saveButton]}
                onPress={validar}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <AwesomeAlert
        show={alertVisible}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#01c05f"
        onConfirmPressed={() => setAlertVisible(false)}
      />
      <AwesomeAlert
        show={confirmDeleteVisible}
        showProgress={false}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta talla?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonColor="#01c05f"
        cancelButtonColor="#01c05f"
        onConfirmPressed={deleteTalla}
        onCancelPressed={() => {
          setConfirmDeleteVisible(false);
          setDeleteId(null);
        }}
        contentContainerStyle={{ zIndex: 20 }}
      />

      <LogoutConfirmation navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 3,
  },
  itemDetails: {
    flex: 1,
  },
  createButton: {
    backgroundColor: "#01c05f",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10, // Espacio entre el input y el botón
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginBottom: 10, // Agrega espacio entre los botones
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f4b619",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e74a3b",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  flatListContent: {
    flexGrow: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  pageButton: {
    fontSize: 16,
    color: "#01c05f",
  },
  pageNumber: {
    fontSize: 16,
    alignSelf: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Fondo oscuro con opacidad
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerContainer: {
    width: "100%", // Asegúrate de que el contenedor tenga el ancho adecuado
    borderColor: "#ccc", // Color del borde
    borderWidth: 1, // Ancho del borde
    borderRadius: 5, // Opcional: redondear las esquinas del borde
    marginBottom: 20, // Espaciado opcional
  },
  picker: {
    height: 50,
    width: "100%", // Asegúrate de que el Picker ocupe todo el ancho del contenedor
  },
  input: {
    width: "100%", // Asegúrate de que el Input ocupe el mismo ancho
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20, // Espaciado opcional
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    margin: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#01c05f",
  },
  cancelButton: {
    backgroundColor: "gray",
  },

  modalItemText: {
    fontSize: 14,
    marginBottom: 5,
  },
  accordionHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#01c05f",
    borderRadius: 5,
    marginBottom: 5,
  },
  accordionItem: {
    marginBottom: 10,
    padding: 10,
    borderBottomColor: "#ddd",
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  accordionContent: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  accordionContainer: {
    // Nuevo estilo para centrar el acordeón
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50, // Ajusta el margen para desplazar el contenido hacia abajo
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  image: {
    width: 30, // Ajusta según sea necesario
    height: 30, // Ajusta según sea necesario
    resizeMode: "contain", // O 'cover', dependiendo del efecto deseado
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  fullImage: {
    width: "80%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default Home;
