import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import AwesomeAlert from "react-native-awesome-alerts";

const Home = () => {
  // URL de la API de productos

  const url = "https://prueba-despliegue-back.onrender.com/api/productos";

  // Estados para manejar datos y UI

  const [productosAdmin, setProductosAdmin] = useState([]);
  const [Disenios, setDisenios] = useState([]);
  const [Insumos, setInsumos] = useState([]);
  const [Colores, setColores] = useState([]);
  const [Tallas, setTallas] = useState([]);
  const [IdProducto, setIdProducto] = useState("");
  const [IdDisenio, setIdDisenio] = useState("");
  const [IdInsumo, setIdInsumo] = useState("");
  const [Referencia, setReferencia] = useState("");
  const [Cantidad, setCantidad] = useState("");
  const [ValorVenta, setValorVenta] = useState("");
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [operation, setOperation] = useState(1);
  const [loading, setLoading] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState({});
  const [insumoExpanded, setInsumoExpanded] = useState(false);
  const [disenioExpanded, setDisenioExpanded] = useState(false);
  const [detalleExpanded, setDetalleExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  // Efecto para obtener datos al cargar el componente

  useEffect(() => {
    getProductosAdmin();
    getDisenios();
    getInsumos();
    getColores();
    getTallas();
  }, []);

  // Funciones para obtener datos desde la API

  const getProductosAdmin = async () => {
    try {
      const respuesta = await axios.get(url);
      setProductosAdmin(respuesta.data);
      console.log(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const getDisenios = async () => {
    try {
      const respuesta = await axios.get(
        "https://prueba-despliegue-back.onrender.com/api/disenios",
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
        "https://prueba-despliegue-back.onrender.com/api/colores",
      );
      setColores(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los colores:", error);
    }
  };

  const getTallas = async () => {
    try {
      const respuesta = await axios.get(
        "https://prueba-despliegue-back.onrender.com/api/tallas",
      );
      setTallas(respuesta.data);
    } catch (error) {
      console.error("Error al obtener las tallas:", error);
    }
  };

  // Funciones para manejar el estado de los productos

  const toggleInsumoAccordion = () => {
    setInsumoExpanded(!insumoExpanded);
  };

  const toggleDisenioAccordion = () => {
    setDisenioExpanded(!disenioExpanded);
  };

  const verDetalle = (producto) => {
    setProductoDetalle(producto);
    setInsumoExpanded(false);
    setDisenioExpanded(false);
    setDetalleVisible(true);
    setDetalleExpanded(!detalleExpanded && true); // Cambia el estado de expansión
  };

  const getInsumos = async () => {
    try {
      const respuesta = await axios.get(
        "https://prueba-despliegue-back.onrender.com/api/insumos",
      );
      const InsumosActivas = respuesta.data.filter(
        (insumo) => insumo.Estado === "Activo",
      );
      setInsumos(InsumosActivas);
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
    }
  };
  const openModal = (op, producto = {}) => {
    if (producto.Estado === "Inactivo") return; // Evitar abrir el modal si el producto está inactivo

    setIdProducto(producto.IdProducto || "");
    setIdDisenio(producto.IdDisenio || "");
    setIdInsumo(producto.IdInsumo || "");
    setReferencia(producto.Referencia || "");
    setCantidad(producto.Cantidad ? producto.Cantidad.toString() : ""); // Convertir a string
    setValorVenta(producto.ValorVenta ? producto.ValorVenta.toString() : ""); // Convertir a string
    setTitle(op === 1 ? "Registrar Producto" : "Editar Producto");
    setOperation(op); // Establece el valor correcto para la operación
    setModalVisible(true);
  };

  // Funciones de validación

  // Función para validar la referencia
  const validateReferencia = (value) => {
    if (!value) {
      return "Escribe la referencia";
    }
    // Validar que la referencia siga el patrón AAA-000
    if (!/^[A-Z]{3}-\d{3}$/.test(value)) {
      return "La referencia debe ser en el formato AAA-000";
    }
    return "";
  };
  // Funciones para cambiar el estado y la publicación del producto

  const cambiarEstado = async (IdProducto) => {
    try {
      const productoActual = productosAdmin.find(
        (producto) => producto.IdProducto === IdProducto,
      );
      const nuevoEstado =
        productoActual.Estado === "Activo" ? "Inactivo" : "Activo";

      const parametrosProducto = {
        IdProducto: IdProducto,
        IdDisenio: productoActual.IdDisenio,
        IdInsumo: productoActual.IdInsumo,
        Referencia: productoActual.Referencia,
        Cantidad: productoActual.Cantidad,
        ValorVenta: productoActual.ValorVenta,
        Publicacion: productoActual.Publicacion,
        Estado: nuevoEstado,
      };

      const response = await axios.put(
        `${url}/${IdProducto}`,
        parametrosProducto,
      );

      if (response.status === 200) {
        setProductosAdmin((prevProducto) =>
          prevProducto.map((producto) =>
            producto.IdProducto === IdProducto
              ? { ...producto, Estado: nuevoEstado }
              : producto,
          ),
        );
        setAlertTitle("Éxito");
        setAlertMessage("Estado de la talla cambiado con éxito");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertTitle("Error");
      setAlertMessage("Error cambiando el estado de la talla");
      setAlertVisible(true);
    }
  };
  const cambiarPublicacion = async (IdProducto) => {
    try {
      const productoActual = productosAdmin.find(
        (producto) => producto.IdProducto === IdProducto,
      );
      const nuevoEstado =
        productoActual.Publicacion === "Activo" ? "Inactivo" : "Activo";

      const parametrosProducto = {
        IdProducto: IdProducto,
        IdDisenio: productoActual.IdDisenio,
        IdInsumo: productoActual.IdInsumo,
        Referencia: productoActual.Referencia,
        Cantidad: productoActual.Cantidad,
        ValorVenta: productoActual.ValorVenta,
        Estado: productoActual.Estado,
        Publicacion: nuevoEstado, // Incluye el campo 'Publicado'
      };

      const response = await axios.put(
        `${url}/${IdProducto}`,
        parametrosProducto,
      );

      if (response.status === 200) {
        setProductosAdmin((prevProducto) =>
          prevProducto.map((producto) =>
            producto.IdProducto === IdProducto
              ? { ...producto, Publicacion: nuevoEstado }
              : producto,
          ),
        );
        setAlertTitle("Éxito");
        setAlertMessage("Publicación del producto cambiado con éxito");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertTitle("Error");
      setAlertMessage("Error cambiando la publicación del producto");
      setAlertVisible(true);
    }
  };

  const validar = () => {
    const insumoSeleccionado = Insumos.find((i) => i.IdInsumo === IdInsumo);

    // Validar cantidad
    if (parseInt(Cantidad, 10) > insumoSeleccionado?.Cantidad) {
      setAlertTitle("Error");
      setAlertMessage(
        "La cantidad de productos no puede ser mayor que la cantidad de insumos disponibles",
      );
      setAlertVisible(true);
      return;
    }

    // Validar valor de venta
    if (parseFloat(ValorVenta) <= parseFloat(insumoSeleccionado?.ValorCompra)) {
      setAlertTitle("Error");
      setAlertMessage(
        "El valor de venta debe ser mayor que el valor de compra del insumo",
      );
      setAlertVisible(true);
      return;
    }

    // Validar referencia
    const referenciaError = validateReferencia(Referencia);
    if (referenciaError) {
      setAlertTitle("Advertencia");
      setAlertMessage(referenciaError);
      setAlertVisible(true);
      return;
    }

    const parametros = {
      IdDisenio,
      IdInsumo,
      Referencia: Referencia.trim(),
      Cantidad: parseInt(Cantidad, 10),
      ValorVenta: parseFloat(ValorVenta),
      IdProducto, // Incluye IdProducto para PUT
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
        // Para editar un producto
        console.log("Enviando parámetros para PUT:", parametros);
        await axios.put(`${url}/${parametros.IdProducto}`, parametros);
        setAlertTitle("Éxito");
        setAlertMessage("Producto editado exitosamente");
      } else if (metodo === "POST") {
        // Para crear un nuevo producto
        console.log("Enviando parámetros para POST:", parametros);
        await axios.post(url, parametros);
        setAlertTitle("Éxito");
        setAlertMessage("Producto creado exitosamente");
      } else if (metodo === "DELETE") {
        // Para eliminar un producto
        console.log("Enviando parámetros para DELETE:", parametros);
        await axios.delete(`${url}/${parametros.IdProducto}`);
        setAlertTitle("Éxito");
        setAlertMessage("Producto eliminado exitosamente");
      }
      getProductosAdmin(); // Obtén los productos actualizados
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

  const confirmDelete = (IdProducto) => {
    setDeleteId(IdProducto);
    setConfirmDeleteVisible(true);
  };

  const deleteTalla = () => {
    if (deleteId !== null) {
      enviarSolicitud("DELETE", { IdProducto: deleteId });
      setConfirmDeleteVisible(false);
      setDeleteId(null);
    }
  };

  const filteredItems = productosAdmin.filter((producto) => {
    const disenio = Disenios.find((d) => d.IdDisenio === producto.IdDisenio);
    const insumo = Insumos.find((i) => i.IdInsumo === producto.IdInsumo);

    return (
      producto.Referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.Cantidad.toString().includes(searchTerm) ||
      producto.ValorVenta.toString().includes(searchTerm) ||
      disenio.NombreDisenio.toLowerCase().includes(
        searchTerm.toLocaleLowerCase(),
      ) ||
      insumo.Referencia.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Renderizado de cada producto en la lista

  const renderItem = ({ item }) => {
    const disenio = Disenios.find((d) => d.IdDisenio === item.IdDisenio);
    const insumo = Insumos.find((i) => i.IdInsumo === item.IdInsumo);

    return (
      <Pressable onPress={() => verDetalle(item)} style={styles.item}>
        <View style={styles.itemContent}>
          <View>
            <Text style={styles.itemText}>Referencia: {item.Referencia}</Text>
            <Text style={styles.itemText}>
              Diseño: {disenio ? disenio.NombreDisenio : "No disponible"}
            </Text>
            <Text style={styles.itemText}>
              Insumo: {insumo ? insumo.Referencia : "No disponible"}
            </Text>
            <Text style={styles.itemText}>Cantidad: {item.Cantidad}</Text>
            <Text style={styles.itemText}>
              Valor de la Venta: {item.ValorVenta}
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
            <Pressable
              onPress={() =>
                item.Estado !== "Inactivo" && confirmDelete(item.IdProducto)
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
                onValueChange={() => cambiarEstado(item.IdProducto)}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Publicación</Text>
              <Switch
                value={item.Publicacion === "Activo"} // Asegúrate de que 'Publicado' es el valor correcto
                onValueChange={() => cambiarPublicacion(item.IdProducto)}
              />
            </View>
          </View>
        </View>
      </Pressable>
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
        keyExtractor={(item) => item.IdProducto.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />

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

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Picker
            selectedValue={IdDisenio}
            onValueChange={(itemValue) => setIdDisenio(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona diseño" value="" />
            {Disenios.map((disenio) => (
              <Picker.Item
                key={disenio.IdDisenio}
                label={disenio.NombreDisenio}
                value={disenio.IdDisenio}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={IdInsumo}
            onValueChange={(itemValue) => setIdInsumo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona insumo" value="" />
            {Insumos.map((insumo) => (
              <Picker.Item
                key={insumo.IdInsumo}
                label={insumo.Referencia}
                value={insumo.IdInsumo}
              />
            ))}
          </Picker>

          <TextInput
            placeholder="Referencia del Producto (AAA-000)"
            value={Referencia}
            onChangeText={setReferencia}
            style={styles.input}
            maxLength={7} // Limitar la longitud del texto a 7 caracteres
          />
          <TextInput
            placeholder="Cantidad"
            value={Cantidad}
            onChangeText={(text) => setCantidad(text.replace(/[^0-9]/g, ""))} // Permitir solo números enteros
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Valor de Venta"
            value={ValorVenta}
            onChangeText={(text) => setValorVenta(text.replace(/[^0-9.]/g, ""))} // Permitir solo números y decimales
            style={styles.input}
            keyboardType="numeric"
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
      </Modal>
      <Modal visible={detalleVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Detalles del Producto</Text>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* Agrega ScrollView */}
            <Pressable
              onPress={() => setDetalleExpanded(!detalleExpanded)}
              style={styles.accordionHeader}
            >
              <Text style={styles.accordionTitle}>Detalles del Producto</Text>
              <Icon
                name={detalleExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </Pressable>
            {detalleExpanded && (
              <View style={styles.accordionContent}>
                <Text style={styles.modalItemText}>
                  Referencia: {productoDetalle.Referencia}
                </Text>
                <Text style={styles.modalItemText}>
                  Diseño:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.NombreDisenio || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Insumo:{" "}
                  {Insumos.find((i) => i.IdInsumo === productoDetalle.IdInsumo)
                    ?.Referencia || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Cantidad: {productoDetalle.Cantidad}
                </Text>
                <Text style={styles.modalItemText}>
                  Valor de la Venta: {productoDetalle.ValorVenta}
                </Text>
              </View>
            )}
            {/* Acordeón para el diseño */}
            <Pressable
              onPress={toggleDisenioAccordion}
              style={styles.accordionHeader}
            >
              <Text style={styles.accordionTitle}>Detalles del Diseño</Text>
              <Icon
                name={disenioExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </Pressable>
            {disenioExpanded && (
              <View style={styles.accordionContent}>
                <Text style={styles.modalItemText}>
                  Nombre del Diseño:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.NombreDisenio || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Fuente:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.Fuente || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Tamaño de Fuente:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.TamanioFuente || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Color de Fuente:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.ColorFuente || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Posición de Fuente:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.PosicionFuente || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Tamaño de Imagen:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.TamanioImagen || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Posición de Imagen:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.PosicionImagen || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Precio del Diseño:{" "}
                  {Disenios.find(
                    (d) => d.IdDisenio === productoDetalle.IdDisenio,
                  )?.PrecioDisenio || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Imagen Diseño:{" "}
                  <Image
                    source={{
                      uri:
                        Disenios.find(
                          (d) => d.IdDisenio === productoDetalle.IdDisenio,
                        )?.ImagenDisenio || "",
                    }}
                    style={styles.image}
                  />
                </Text>
                <Text style={styles.modalItemText}>
                  Imagen Referencia:{" "}
                  <Image
                    source={{
                      uri:
                        Disenios.find(
                          (d) => d.IdDisenio === productoDetalle.IdDisenio,
                        )?.ImagenReferencia || "",
                    }}
                    style={styles.image}
                  />
                </Text>
              </View>
            )}
            <Pressable
              onPress={toggleInsumoAccordion}
              style={styles.accordionHeader}
            >
              <Text style={styles.accordionTitle}>Insumo</Text>
              <Icon
                name={insumoExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </Pressable>
            {insumoExpanded && (
              <View style={styles.accordionContent}>
                <Text style={styles.modalItemText}>
                  Color del Insumo:{" "}
                  {Colores.find(
                    (c) =>
                      c.IdColor ===
                      Insumos.find(
                        (i) => i.IdInsumo === productoDetalle.IdInsumo,
                      )?.IdColor,
                  )?.Color || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Talla del insumo:{" "}
                  {Tallas.find(
                    (t) =>
                      t.IdTalla ===
                      Insumos.find(
                        (i) => i.IdInsumo === productoDetalle.IdInsumo,
                      )?.IdTalla,
                  )?.Talla || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Referencia del insumo:{" "}
                  {Insumos.find((i) => i.IdInsumo === productoDetalle.IdInsumo)
                    ?.Referencia || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Cantidad:{" "}
                  {Insumos.find((i) => i.IdInsumo === productoDetalle.IdInsumo)
                    ?.Cantidad || "No disponible"}
                </Text>
                <Text style={styles.modalItemText}>
                  Valor de la compra del insumo:{" "}
                  {Insumos.find((i) => i.IdInsumo === productoDetalle.IdInsumo)
                    ?.ValorCompra || "No disponible"}
                </Text>
              </View>
            )}
          </ScrollView>

          <Pressable
            style={styles.button}
            onPress={() => setDetalleVisible(false)}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  createButton: {
    backgroundColor: "#01c05f",
    padding: 10,
    borderRadius: 4,
    marginLeft: 10, // Espacio entre el input y el botón
  },
  buttonsContainer: {
    flexDirection: "column", // Organiza los botones verticalmente
    alignItems: "flex-end", // Alinea los botones al final del contenedor
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
    fontSize: 16,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    marginBottom: 10,
  },
  picker: {
    backgroundColor: "#fff",
    marginBottom: 10,
    height: 50, // Asegúrate de que la altura sea la misma que la del TextInput
    width: "80%", // Asegúrate de que el ancho sea el mismo que el del TextInput
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    backgroundColor: "#01c05f",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#01c05f",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  modalItemText: {
    fontSize: 18, // Cambia el tamaño de la fuente según lo necesites
    color: "#fff", // Cambia el color de la fuente según lo necesites
    marginBottom: 8, // Espaciado entre líneas
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#01c05f",
    borderRadius: 5,
    marginBottom: 15,
  },
  accordionTitle: {
    fontSize: 18,
    color: "#fff",
  },
  accordionContent: {
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 5,
    marginBottom: 10, // Añadir margen inferior
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
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ajusta el espaciado entre el buscador y el botón
    marginBottom: 20, // Espacio inferior para separar de la lista
  },
});

export default Home;
