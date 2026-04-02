# 👕 Soft-Shirt-Mobile

Aplicación móvil desarrollada con **React Native** y **Expo** para explorar y gestionar camisetas de forma interactiva desde tu smartphone o tablet.

---

### 📋 Descripción

Soft-Shirt-Mobile es el cliente móvil de la plataforma Soft Shirt. Permite a los usuarios navegar por un catálogo de camisetas, personalizar colores y tallas, gestionar compras y ventas, y administrar su cuenta de forma sencilla.

---

### 🚀 Tecnologías

| Tecnología | Versión |
|---|---|
| React Native | 0.74.5 |
| Expo | 51.x |
| React Navigation | 6.x |
| Axios | 1.7.x |
| Galio Framework | 0.8.0 |
| AsyncStorage | 1.23.x |

---

### 📂 Estructura del Proyecto

```
Soft-Shirt-Mobile/
├── App.js                  # Punto de entrada principal
├── index.js                # Registro de la app
├── screens/                # Pantallas de la aplicación
│   ├── HomeScreen/
│   ├── ColoresScreen/
│   ├── TallasScreen/
│   ├── ComprasScreen/
│   ├── VentasScreen/
│   ├── SinginScreen/
│   ├── ForgotPasswordScreen/
│   ├── NewPasswordScreen/
│   ├── CodigoVerificacionScreen/
│   └── LoadingScreen/
├── components/             # Componentes reutilizables
│   ├── CustomButton.js
│   ├── CustomInput.js
│   ├── DrawerItem.js
│   ├── Header.js
│   ├── Icon.js
│   ├── LogoutConfirmation.js
│   └── Tabs.js
├── navigation/             # Configuración de navegación
├── constants/              # Constantes y configuración
└── assets/                 # Recursos estáticos (imágenes, fuentes)
```

---

### ✨ Funcionalidades

- 🏠 **Home** — Pantalla principal con catálogo de camisetas
- 🎨 **Colores** — Exploración y selección de colores disponibles
- 📏 **Tallas** — Gestión de tallas
- 🛒 **Compras** — Historial y gestión de compras
- 💰 **Ventas** — Módulo de ventas
- 🔐 **Autenticación** — Registro, login, recuperación de contraseña y verificación por código
- 📱 **Navegación Drawer** — Menú lateral para navegar entre secciones

---

### ⚙️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/DorlixitoG/Soft-Shirt-Mobile.git

# Entrar al directorio
cd Soft-Shirt-Mobile

# Instalar dependencias
npm install

# Iniciar el proyecto
expo start
```

---

### 📱 Ejecutar en dispositivo

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

### 🛠️ Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo Expo |
| `npm run android` | Ejecuta en emulador/dispositivo Android |
| `npm run ios` | Ejecuta en emulador/dispositivo iOS |
| `npm run web` | Ejecuta en navegador web |
| `npm run lint` | Ejecuta ESLint para análisis de código |
| `npm run build` | Genera build para Android |

---

### 📦 Dependencias principales

- **React Navigation** (Stack + Drawer) — Navegación entre pantallas
- **Axios** — Peticiones HTTP a la API
- **Galio Framework** — Componentes UI estilizados
- **AsyncStorage** — Almacenamiento local persistente
- **React Native Reanimated** — Animaciones fluidas
- **React Native Awesome Alerts** — Alertas personalizadas
- **React Native Color Picker** — Selector de colores

---

### 🤝 Contribución

1. Haz un fork del proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

### 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

> Desarrollado con ❤️ por [Kevin Vasquez](https://github.com/DorlixitoG)
```

Puedes copiar y pegar esto directamente como tu archivo `README.md`. ¿Quieres que le haga algún ajuste o que lo suba directamente al repo?
