# Mi APR - Sistema de Gestión de Agua Potable Rural

## Descripción General

Mi APR es un sistema web desarrollado en Angular 17 para la gestión integral de servicios de Agua Potable Rural (APR). El sistema permite la administración de usuarios, lecturas de medidores y gestión de datos relacionados con el suministro de agua potable.

## Características Principales

### 🏗️ Arquitectura
- **Framework**: Angular 17 con componentes standalone
- **UI Components**: Angular Material
- **Estilos**: SCSS con metodología BEM
- **Estado**: Angular Signals para gestión reactiva
- **Routing**: Router de Angular con guards de autenticación

### 🎨 Diseño
- Tema personalizado basado en tonos azules profesionales
- Diseño responsive que se adapta a móviles, tablets y desktop
- Interfaz intuitiva y accesible (WCAG AA compliant)

### 🔐 Seguridad y Autenticación
- Sistema de autenticación basado en localStorage
- Control de acceso basado en roles (RBAC)
- Guards de ruta para proteger páginas sensibles
- Validación de datos en frontend

### 👥 Gestión de Usuarios
- Registro y login de usuarios
- 4 roles distintos: admin, funcionario, técnico, cliente
- Gestión de perfiles de usuario
- Administración de usuarios (solo para administradores)

### 📊 Funcionalidades del Sistema
- Dashboard personalizado por rol
- Gestión de lecturas de medidores
- Formularios reactivos con validación
- Notificaciones del sistema
- Gestión de perfil de usuario

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/         # Componentes reutilizables
│   ├── core/              # Servicios core, guards, modelos
│   ├── features/          # Módulos de funcionalidades
│   ├── shared/            # Componentes y servicios compartidos
│   └── app.config.ts      # Configuración de la aplicación
├── assets/                # Recursos estáticos
└── styles.scss           # Estilos globales y tema
```

## Componentes Principales

### Componentes Reutilizables
- **ActionButtonComponent**: Botón personalizable con estados
- **FeatureCardComponent**: Tarjeta para mostrar características
- **NavbarComponent**: Barra de navegación principal
- **PageHeaderComponent**: Encabezado de página estándar

### Páginas Principales
- **HomeComponent**: Página de inicio
- **DashboardComponent**: Panel principal del usuario
- **LoginComponent**: Inicio de sesión
- **RegisterComponent**: Registro de usuario
- **ProfileComponent**: Gestión de perfil
- **ReadingsComponent**: Gestión de lecturas
- **UserManagementComponent**: Administración de usuarios

## Servicios Core

### AuthService
Gestiona la autenticación y autorización:
- Login/logout de usuarios
- Verificación de tokens
- Control de acceso por roles

### UserManagementService
Administra los datos de usuarios:
- CRUD de usuarios
- Validación de datos
- Gestión de roles

### ValidationService
Proporciona validaciones personalizadas:
- Validación de teléfonos chilenos
- Validación de contraseñas seguras
- Validaciones de formularios

### NotificationService
Sistema de notificaciones:
- Mensajes de éxito, error, advertencia e información
- Posicionamiento personalizable
- Animaciones suaves

## Roles y Permisos

### 🔴 Admin
- Acceso completo al sistema
- Gestión de usuarios
- Configuración del sistema

### 🟡 Funcionario
- Gestión de lecturas
- Acceso a reportes
- Gestión de clientes

### 🟢 Técnico
- Mantenimiento del sistema
- Gestión de equipos
- Reportes técnicos

### 🔵 Cliente
- Vista de consumo personal
- Historial de lecturas
- Gestión de perfil básico

## Tecnologías Utilizadas

- **Angular 17**: Framework principal
- **Angular Material**: Componentes UI
- **TypeScript**: Lenguaje de programación
- **SCSS**: Preprocesador de CSS
- **RxJS**: Programación reactiva
- **Angular CDK**: Kit de desarrollo de componentes

## Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Generar documentación
npm run docs

# Construir para producción
npm run build
```

## Contacto y Soporte

Para más información sobre el sistema Mi APR, contacte al equipo de desarrollo.
