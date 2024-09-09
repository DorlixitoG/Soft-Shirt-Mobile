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
import { ColorPicker } from "react-native-color-picker";
import Slider from "@react-native-community/slider";

const ColoresScreen = ({ navigation }) => {
  const url = "https://back-end1-9e2f0d364f68.herokuapp.com/api/colores";

  // Estados para manejar datos y UI

  const [Colores, setColores] = useState([]);
  const [IdColor, setIdColor] = useState("");
  const [Color, setColor] = useState("");
  const [Referencia, setReferencia] = useState("");
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
  const [selectedColor, setSelectedColor] = useState("");

  // Efecto para obtener datos al cargar el componente

  useEffect(() => {
    getColores();
  }, []);

  // Funciones para obtener datos desde la API

  const getColores = async () => {
    try {
      const respuesta = await axios.get(
        "https://back-end1-9e2f0d364f68.herokuapp.com/api/colores",
      );
      console.log(respuesta.data); // Verifica los datos recibidos
      setColores(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los colores:", error);
    }
  };

  const openModal = (op, color = {}) => {
    if (color.Estado === "Inactivo") return; // Evitar abrir el modal si el producto está inactivo
    setIdColor(color.IdColor || "");
    setColor(color.Color || "");
    setReferencia(color.Referencia || "");
    setSelectedColor(color.Referencia || "#000000"); // Inicializa selectedColor con el valor de Referencia
    setTitle(op === 1 ? "Registrar Producto" : "Editar Producto");
    setOperation(op);
    setPlaceholderCantidad("Cantidad");
    setAlertMessage("");
    setModalVisible(true);
  };

  // Funciones de validación

  // Funciones para cambiar el estado y la publicación del producto

  const cambiarEstado = async (IdColor) => {
    try {
      // Verifica si el color está asociado con algún insumo
      const insumosResponse = await axios.get(
        "https://back-end1-9e2f0d364f68.herokuapp.com/api/insumos",
      );

      
      const insumos = insumosResponse.data;

      const colorActual = Colores.find((color) => color.IdColor === IdColor);
      const nuevoEstadoColor =
        colorActual.Estado === "Activo" ? "Inactivo" : "Activo";

      // Verifica asociación con insumos antes de cambiar el estado
      if (nuevoEstadoColor === "Inactivo") {
        const asociadoConInsumos = insumos.some(
          (insumo) => insumo.IdColor === IdColor,
        );

        if (asociadoConInsumos) {
          setAlertTitle("Error");
          setAlertMessage(
            "No se puede cambiar el estado a 'Inactivo' porque el color está asociado con insumos.",
          );
          setAlertVisible(true);
          return;
        }
      }

      // Si pasa la validación, procede a cambiar el estado
      const parametrosColor = {
        IdColor: IdColor,
        Color: colorActual.Color,
        Referencia: colorActual.Referencia,
        Estado: nuevoEstadoColor,
      };

      console.log("Enviando parámetros para cambiar estado:", parametrosColor);

      const response = await axios.put(`${url}/${IdColor}`, parametrosColor);

      console.log("Respuesta del backend para cambiar estado:", response.data);

      if (response.status === 200) {
        setColores((prevColores) =>
          prevColores.map((color) =>
            color.IdColor === IdColor
              ? { ...color, Estado: nuevoEstadoColor }
              : color,
          ),
        );
        setAlertTitle("Éxito");
        setAlertMessage("Estado cambiado con éxito");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error.response?.data);
      setAlertTitle("Error");
      setAlertMessage("Error al cambiar el estado");
      setAlertVisible(true);
    }
  };

  const validar = () => {
    // Validar referencia
    if (!Color.trim()) {
      setAlertTitle("Error");
      setAlertMessage("El campo Color es obligatorio.");
      setAlertVisible(true);
      return;
    }
    const parametros = {
      Color: Color.trim(),
      Referencia: selectedColor,
      IdColor, // Incluye IdInsumo para PUT
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
        // Para editar un color
        console.log("Enviando parámetros para PUT:", parametros);
        await axios.put(`${url}/${parametros.IdColor}`, parametros);
        setAlertTitle("Éxito");
        setAlertMessage("color editado exitosamente");
      } else if (metodo === "POST") {
        // Para crear un nuevo color
        console.log("Enviando parámetros para POST:", parametros);
        await axios.post(url, parametros);
        setAlertTitle("Éxito");
        setAlertMessage("color creado exitosamente");
      } else if (metodo === "DELETE") {
        // Para eliminar un color
        console.log("Enviando parámetros para DELETE:", parametros);
        await axios.delete(`${url}/${parametros.IdColor}`);
        setAlertTitle("Éxito");
        setAlertMessage("color eliminado exitosamente");
      }
      getColores(); // Obtén los colore actualizados
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

  const confirmDelete = (IdColor) => {
    setDeleteId(IdColor);
    setConfirmDeleteVisible(true);
  };

  const deleteTalla = () => {
    if (deleteId !== null) {
      enviarSolicitud("DELETE", { IdColor: deleteId });
      setConfirmDeleteVisible(false);
      setDeleteId(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getColores();
    setRefreshing(false);
  };

  const filteredItems = Colores.filter((color) => {
    return (
      color.Color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.Referencia.toString().includes(searchTerm) ||
      color.Estado.toString().includes(searchTerm)
    );
  });

  // Renderizado de cada insumos en la lista

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Color: {item.Color}</Text>
            <Text style={styles.itemText}>Referencia: </Text>
            <View
              style={[
                styles.colorBox,
                { backgroundColor: item.Referencia }, // Se asigna el valor hexadecimal
              ]}
            />
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
            <Pressable
              onPress={() =>
                item.Estado !== "Inactivo" && confirmDelete(item.IdColor)
              }
              style={[
                styles.deleteButton,
                { opacity: item.Estado === "Inactivo" ? 0.5 : 1 },
              ]}
              disabled={item.Estado === "Inactivo"}
            >
              <Icon name="trash" size={20} color="#fff" />
            </Pressable>

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Estado</Text>
              <Switch
                value={item.Estado === "Activo"}
                onValueChange={() => cambiarEstado(item.IdColor)}
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
        keyExtractor={(item) => item.IdColor.toString()}
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
            <TextInput
              style={styles.input}
              placeholder="Color"
              value={Color}
              onChangeText={setColor}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ColorPicker
                onColorSelected={(color) => {
                  console.log("Color seleccionado:", color); // Agrega este log
                  setSelectedColor(color);
                }}
                style={{ height: 200, width: 200 }}
                defaultColor={selectedColor}
                sliderComponent={Slider}
              />
            </View>

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
  colorBox: {
    width: 80, // Ajusta el tamaño del cuadro de color
    height: 60, // Ajusta el tamaño del cuadro de color
    borderRadius: 5,
    marginVertical: 5,
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
    paddingBottom: 0, // Asegúrate de que no haya padding extra.
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

export default ColoresScreen;
