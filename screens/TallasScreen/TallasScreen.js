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
import AwesomeAlert from "react-native-awesome-alerts";
import LogoutConfirmation from "../../components/LogoutConfirmation";
const TallasScreen = ({ navigation }) => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/tallas";

  // Estados para manejar datos y UI

  const [Tallas, setTallas] = useState([]);
  const [IdTalla, setIdTalla] = useState("");
  const [Talla, setTalla] = useState("");
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
  const validTallas = [
    "XXXS",
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "XXXXL",
  ];

  // Efecto para obtener datos al cargar el componente

  useEffect(() => {
    getTallas();
  }, []);

  // Funciones para obtener datos desde la API

  const getTallas = async () => {
    try {
      const respuesta = await axios.get(
        "https://softshirt-1c3fad7d72e8.herokuapp.com/api/tallas",
      );
      console.log(respuesta.data); // Verifica los datos recibidos
      setTallas(respuesta.data);
    } catch (error) {
      console.error("Error al obtener las tallas:", error);
    }
  };

  const openModal = (op, talla = {}) => {
    if (talla.Estado === "Inactivo") return; // Evitar abrir el modal si el producto está inactivo
    setIdTalla(talla.IdTalla || "");
    setTalla(talla.Talla || "");
    setTitle(op === 1 ? "Registrar Producto" : "Editar Producto");
    setOperation(op);
    setAlertMessage("");
    setModalVisible(true);
  };

  // Funciones de validación

  // Funciones para cambiar el estado y la publicación del producto

  const cambiarEstado = async (IdTalla) => {
    try {
      // Verifica si la talla está asociado con algún insumo
      const insumosResponse = await axios.get(
        "https://softshirt-1c3fad7d72e8.herokuapp.com/api/insumos",
      );

      const insumos = insumosResponse.data;

      const tallaActual = Tallas.find((talla) => talla.IdTalla === IdTalla);
      const nuevoEstadoTalla =
        tallaActual.Estado === "Activo" ? "Inactivo" : "Activo";

      // Verifica asociación con insumos antes de cambiar el estado
      if (nuevoEstadoTalla === "Inactivo") {
        const asociadoConInsumos = insumos.some(
          (talla) => talla.IdTalla === IdTalla,
        );

        if (asociadoConInsumos) {
          setAlertTitle("Error");
          setAlertMessage(
            "No se puede cambiar el estado a 'Inactivo' porque la talla está asociado con insumos.",
          );
          setAlertVisible(true);
          return;
        }
      }

      // Si pasa la validación, procede a cambiar el estado
      const parametrosTalla = {
        IdTalla: IdTalla,
        Talla: tallaActual.Talla,
        Estado: nuevoEstadoTalla,
      };

      console.log("Enviando parámetros para cambiar estado:", parametrosTalla);

      const response = await axios.put(`${url}/${IdTalla}`, parametrosTalla);

      console.log("Respuesta del backend para cambiar estado:", response.data);

      if (response.status === 200) {
        setTallas((prevTallas) =>
          prevTallas.map((talla) =>
            talla.IdTalla === IdTalla
              ? { ...talla, Estado: nuevoEstadoTalla }
              : talla,
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
    if (!Talla.trim()) {
      setAlertTitle("Error");
      setAlertMessage("El campo Talla es obligatorio.");
      setAlertVisible(true);
      return;
    }
    if (!validTallas.includes(Talla.trim())) {
      setAlertTitle("Error");
      setAlertMessage(
        `La talla debe ser una de las siguientes: \n${validTallas.join(", ")}`,
      );
      setAlertVisible(true);
      return;
    }

    const parametros = {
      Talla: Talla.trim(),
      IdTalla,
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
        // Para editar un talla
        console.log("Enviando parámetros para PUT:", parametros);
        await axios.put(`${url}/${parametros.IdTalla}`, parametros);
        setAlertTitle("Éxito");
        setAlertMessage("talla editado exitosamente");
      } else if (metodo === "POST") {
        // Para crear un nuevo talla
        console.log("Enviando parámetros para POST:", parametros);
        await axios.post(url, parametros);
        setAlertTitle("Éxito");
        setAlertMessage("talla creado exitosamente");
      } else if (metodo === "DELETE") {
        // Para eliminar un talla
        console.log("Enviando parámetros para DELETE:", parametros);
        await axios.delete(`${url}/${parametros.IdTalla}`);
        setAlertTitle("Éxito");
        setAlertMessage("talla eliminado exitosamente");
      }
      getTallas(); // Obtén las talla actualizados
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

  const confirmDelete = (IdTalla) => {
    setDeleteId(IdTalla);
    setConfirmDeleteVisible(true);
  };

  const deleteTalla = () => {
    if (deleteId !== null) {
      enviarSolicitud("DELETE", { IdTalla: deleteId });
      setConfirmDeleteVisible(false);
      setDeleteId(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getTallas();
    setRefreshing(false);
  };

  const filteredItems = Tallas.filter((Talla) => {
    return (
      Talla.Talla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Talla.Estado.toString().includes(searchTerm)
    );
  });

  // Renderizado de cada insumos en la lista

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Talla: {item.Talla}</Text>
            <View
              style={[
                styles.colorBox,
                { backgroundColor: item.Referencia }, // Se asigna el valor hexadecimal
              ]}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Estado</Text>
            <Switch
              value={item.Estado === "Activo"}
              onValueChange={() => cambiarEstado(item.IdTalla)}
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
                item.Estado !== "Inactivo" && confirmDelete(item.IdTalla)
              }
              style={[
                styles.deleteButton,
                { opacity: item.Estado === "Inactivo" ? 0.5 : 1 },
              ]}
              disabled={item.Estado === "Inactivo"}
            >
              <Icon name="trash" size={20} color="#fff" />
            </Pressable>
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
        keyExtractor={(item) => item.IdTalla.toString()}
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
              placeholder="Talla"
              value={Talla}
              onChangeText={setTalla}
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
    alignItems: "center", // Alinea los elementos verticalmente al centro
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 3,
  },
  itemDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#01c05f",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10, // Espacio entre el input y el botón
  },
  buttonsContainer: {
    flexDirection: "row", // Cambiado de columna a fila para alinear los botones horizontalmente
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8, // Espacio entre los botones y el switch
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 5, // Espacio entre la etiqueta del switch y el switch
  },
  editButton: {
    marginRight: 10, // Espacio entre los botones de edición y eliminación
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#f4b619",
  },
  deleteButton: {
    marginRight: 10, // Espacio entre los botones de eliminación y el switch
    padding: 8,
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

export default TallasScreen;
