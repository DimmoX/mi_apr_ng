# Sistema de Gestión APR (Agua Potable Rural)

Un sistema web moderno desarrollado en Angular 17 para la gestión de usuarios y lecturas de agua en sistemas de Agua Potable Rural.

## 🚀 Características

### ✅ Implementado
- **Autenticación y Autorización**: Sistema seguro con JWT-like local storage
- **Gestión de Roles**: 4 tipos de usuario (admin, funcionario, técnico, cliente)
- **Registro y Login**: Formularios reactivos con validación avanzada
- **Recuperación de Contraseña**: Sistema que muestra y permite copiar contraseñas
- **Layout Unificado**: Navegación y footer presentes en TODAS las páginas
- **Menú de Navegación Inteligente**: Enlaces contextuales según rol del usuario
- **Dashboard Dinámico**: Interfaz adaptativa según el rol del usuario
- **Gestión de Usuarios**: Panel administrativo para CRUD de usuarios
- **Perfil de Usuario**: Componente para editar información personal
- **Lecturas de Agua**: Sistema completo de gestión de lecturas con selección de cliente y medidor
- **Páginas Públicas**: Home, About, Services, Contact completamente funcionales
- **Validaciones**: Teléfonos chilenos, contraseñas seguras, emails
- **UI/UX Moderno**: Angular Material con diseño responsive
- **Datos de Prueba**: Sistema inicializado con usuarios de ejemplo
- **Notificaciones**: Sistema centralizado con SnackBar en esquina superior derecha
- **Testing Suite**: 35 tests unitarios (Navbar: 15, Login: 20) - 100% success ✅
- **Navegación Funcional**: Botones de volver operativos en todas las páginas
- **Gestión de Medidores**: Sistema completo de solicitud y aprobación de medidores
- **Documentación Automática**: Generada con Compodoc
- **Arquitectura Escalable**: Componentes standalone de Angular 17

### 🔐 Sistema de Autenticación Completo
- **Login**: Acceso seguro con validaciones
- **Registro Público**: Los usuarios se registran automáticamente como "Cliente"
- **Registro Admin**: Los administradores pueden crear usuarios con cualquier rol
- **Recuperación de Contraseña**: Búsqueda y copia de contraseñas al portapapeles
- **Validaciones Completas**: Teléfono chileno, contraseñas seguras, emails únicos

### 🔧 Sistema de Gestión de Medidores
- **Solicitud de Medidores**: Los clientes pueden solicitar el registro de sus medidores
- **Notificación Automática**: Alerta amarilla en dashboard para clientes sin medidores
- **Modal Automático**: Se abre automáticamente en "Mis Medidores" si no tiene medidores
- **Gestión Administrativa**: Personal autorizado (admin, funcionario, técnico) puede:
  - Ver todas las solicitudes pendientes
  - Aprobar solicitudes e instalar medidores
  - Rechazar solicitudes con motivo
  - Consultar historial de solicitudes procesadas
- **Estados de Solicitud**: Pendiente, Aprobada, Rechazada
- **Persistencia**: Todas las solicitudes se guardan en localStorage

## 🎭 Sistema de Roles Detallado

### **🔴 Administrador (admin)**
**Acceso completo al sistema**
- ✅ **Gestión de Usuarios**: CRUD completo de usuarios, asignación de roles
- ✅ **Gestión de Medidores**: Aprobar/rechazar solicitudes, consultar historial
- ✅ **Lecturas**: Ver todas las lecturas, registrar nuevas
- ✅ **Dashboard**: Vista ejecutiva con métricas generales
- ✅ **Configuración**: Acceso a todas las configuraciones del sistema
- ✅ **Reportes**: Generar reportes completos del sistema

### **🟡 Funcionario (funcionario)**
**Gestión operativa y administrativa**
- ✅ **Gestión de Medidores**: Aprobar/rechazar solicitudes de medidores
- ✅ **Lecturas**: Ver todas las lecturas, registrar lecturas para clientes
- ✅ **Dashboard**: Vista operativa con métricas del día
- ✅ **Reportes**: Generar reportes operativos y de gestión
- ✅ **Mantenimiento**: Coordinar tareas de mantenimiento
- ❌ **Gestión de Usuarios**: No puede crear/eliminar usuarios

### **🟢 Técnico (tecnico)**
**Mantenimiento y operaciones técnicas**
- ✅ **Gestión de Medidores**: Aprobar/rechazar solicitudes, instalar medidores
- ✅ **Lecturas**: Ver todas las lecturas, registrar lecturas técnicas
- ✅ **Dashboard**: Vista técnica con alertas de mantenimiento
- ✅ **Mantenimiento**: Gestionar equipos y reparaciones
- ✅ **Reportes Técnicos**: Generar reportes de estado de equipos
- ❌ **Gestión de Usuarios**: No puede gestionar usuarios

### **🔵 Cliente (cliente)**
**Acceso personal y solicitudes**
- ✅ **Mis Medidores**: Solicitar registro de medidores, ver estado
- ✅ **Mis Lecturas**: Ver historial personal de consumo
- ✅ **Mi Perfil**: Editar información personal básica
- ✅ **Dashboard**: Vista personal con consumo y alertas
- ✅ **Notificaciones**: Recibir alertas sobre su servicio
- ❌ **Datos de Otros**: No puede ver información de otros usuarios

### **Menú Contextual por Rol**
**Todos los Usuarios Autenticados:**
- Dashboard (vista principal)
- Mi Perfil (edición de datos personales)
- Lecturas (gestión de lecturas de agua)
- Mis Medidores (solo clientes)

**Personal Autorizado (Admin/Funcionario/Técnico):**
- Gestión de Medidores (administración de solicitudes)

**Administradores Adicional:**
- Administración > Gestión de Usuarios (CRUD completo de usuarios)

## 🔑 Flujo de Recuperación de Contraseña

### Acceso al Sistema
1. **Desde Login**: Click en "¿Olvidaste tu contraseña?" 
2. **Ruta Directa**: `/forgot-password`

### Proceso de Recuperación
1. **Ingreso de Email**: El usuario ingresa su email registrado
2. **Búsqueda**: El sistema busca la contraseña en el localStorage
3. **Visualización**: Se muestra la contraseña de manera elegante y segura
4. **Copia Fácil**: Botón para copiar la contraseña al portapapeles
5. **Finalización**: Ir al login para acceder al sistema

### Características del Sistema
- ✅ **Búsqueda Instantánea**: Encuentra la contraseña en el localStorage
- ✅ **Visualización Elegante**: Tarjeta especial para mostrar la contraseña
- ✅ **Copia al Portapapeles**: Un click para copiar la contraseña
- ✅ **Feedback Visual**: Confirmación cuando se copia exitosamente
- ✅ **Responsive**: Funciona perfectamente en móviles y desktop
- ✅ **Seguridad Visual**: Recomendación de cambiar contraseña

### Interfaz de Usuario
- **Formulario Simple**: Solo requiere el email del usuario
- **Tarjeta de Contraseña**: Diseño atractivo con gradientes y sombras
- **Botón de Copia**: Icono intuitivo con tooltip explicativo
- **Nota de Seguridad**: Recordatorio para cambiar la contraseña
- **Navegación Fluida**: Enlace claro para ir al login después de recuperar

### Funcionalidad de Copia
- **Clipboard API**: Utiliza la API moderna del navegador
- **Fallback**: Sistema alternativo para navegadores antiguos
- **Confirmación**: Mensaje de éxito al copiar
- **Error Handling**: Manejo de errores si no se puede copiar

---

## 🧭 Sistema de Navegación y Layout

### Layout Unificado
- **Navegación Superior**: Presente en TODAS las páginas del sistema
- **Footer Persistente**: Visible en todas las vistas para consistencia
- **Responsive Design**: Adaptable a dispositivos móviles y desktop

### Navegación Inteligente
- **Páginas Públicas**: Home, Servicios, Nosotros, Contacto (siempre visibles)
- **Autenticación**: Botones de Login/Registro cuando no está autenticado
- **Menú de Usuario**: Desplegable con opciones contextuales cuando está autenticado

### Menú Contextual por Rol
**Todos los Usuarios Autenticados:**
- Dashboard (vista principal)
- Mi Perfil (edición de datos personales)
- Lecturas (gestión de lecturas de agua)

**Administradores Adicional:**
- Administración > Gestión de Usuarios (CRUD completo de usuarios)

### Características del Layout
- **Navegación Sticky**: La barra superior se mantiene visible al hacer scroll
- **Indicadores Visuales**: Enlaces activos claramente marcados
- **Menú Móvil**: Hamburger menu para dispositivos pequeños
- **Logo/Branding**: APR Sistema con icono de gota de agua

---

## 🛠️ Stack Tecnológico

### **Frontend Framework**
- **Angular 17**: Framework principal con standalone components
- **Angular Material**: Biblioteca de componentes UI
- **Angular CDK**: Kit de desarrollo de componentes
- **TypeScript**: Lenguaje de programación tipado
- **SCSS**: Preprocesador CSS con metodología BEM

### **Estado y Reactivity**
- **Angular Signals**: Estado reactivo nativo de Angular 17
- **Reactive Forms**: Formularios reactivos de Angular
- **RxJS**: Programación reactiva y observables

### **UI/UX y Estilos**
- **Tema Personalizado**: Basado en tonos azules profesionales (#1A61AE)
- **Responsive Design**: Mobile-first con breakpoints CSS
- **Animaciones**: Angular Animations API
- **Iconografía**: Material Icons y Google Fonts

### **🧪 Testing Framework**
- **Jasmine**: Framework de testing unitario
- **Karma**: Test runner para navegadores
- **Chrome Headless**: Navegador para CI/CD pipelines
- **Angular Testing Utilities**: TestBed, ComponentFixture, etc.

### **📚 Documentación**
- **Compodoc**: Generación automática de documentación
- **JSDoc**: Comentarios de código estándar
- **Markdown**: README y documentación adicional

### **🔧 Herramientas de Desarrollo**
- **Angular CLI**: Herramientas de construcción y desarrollo
- **ESLint**: Linter para calidad de código
- **Prettier**: Formateador de código
- **Git**: Control de versiones

## ⚡ Instalación y Ejecución

### **🚀 Comandos Principales**

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve
# o alternativamente:
npm start

# Ejecutar tests unitarios
npm test

# Ejecutar tests una sola vez (para CI/CD)
npm test -- --no-watch --no-progress --browsers=ChromeHeadless

# Ejecutar tests con cobertura
ng test --code-coverage

# Construir para producción
ng build

# Construir para desarrollo
ng build --configuration development

# Generar documentación con Compodoc
npm run compodoc

# Generar documentación y servir en vivo
npm run compodoc:serve

# Generar documentación con cobertura
npm run compodoc:coverage

# Lint del código
ng lint

# Formatear código
npm run format
```

### **🌐 URLs de Acceso**

- **Aplicación**: `http://localhost:4200`
- **Documentación**: `http://localhost:8080` (con `compodoc:serve`)
- **Tests**: Ejecutan en navegador automáticamente

### **📋 Requisitos del Sistema**

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior  
- **Angular CLI**: v17.0.0 o superior

```bash
# Verificar versiones
node --version
npm --version
ng version
```

## 📚 Documentación del Proyecto

### Compodoc - Documentación Automática

El proyecto utiliza **Compodoc** para generar documentación automática del código Angular.

#### 🚀 Comandos Disponibles

```bash
# Generar documentación estática
npm run compodoc

# Generar y servir documentación en vivo
npm run compodoc:serve

# Generar documentación con cobertura
npm run compodoc:coverage
```

#### 📖 Acceso a la Documentación

- **Local**: La documentación se genera en la carpeta `docs/`
- **Servidor local**: Al usar `compodoc:serve` estará disponible en `http://localhost:8080`
- **Archivo principal**: `docs/index.html`

#### 📋 Contenido de la Documentación

La documentación incluye:

- **Componentes**: Todos los componentes con sus propiedades y métodos
- **Servicios**: Inyectables con su documentación de API
- **Interfaces**: Tipos de datos y modelos del sistema
- **Módulos**: Estructura modular de la aplicación
- **Dependencias**: Grafo de dependencias del proyecto
- **Cobertura**: Análisis de documentación del código

#### 🎯 Características Generadas

- ✅ **Navegación interactiva**: Menú lateral con todas las secciones
- ✅ **Búsqueda**: Funcionalidad de búsqueda en toda la documentación
- ✅ **Gráficos**: Visualización de dependencias entre módulos
- ✅ **Responsive**: Documentación adaptable a dispositivos móviles
- ✅ **Tema moderno**: Interfaz limpia y profesional
- ✅ **Exportable**: Documentación estática lista para deployar

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | admin@apr.cl | admin123 |
| **Funcionario** | funcionario@apr.cl | funcionario123 |
| **Técnico** | tecnico@apr.cl | tecnico123 |
| **Cliente 1** | cliente1@apr.cl | cliente123 |
| **Cliente 2** | cliente2@apr.cl | cliente123 |
| **Cliente 3** | cliente3@apr.cl | cliente123 |

## 💧 Datos de Prueba - Lecturas de Agua

El sistema incluye lecturas de prueba precargadas para demostrar la funcionalidad:

### 📊 **Lecturas de Ana López (cliente)**
- **3 lecturas históricas** (abril, mayo, junio 2025)
- **1 lectura pendiente** (julio 2025)
- **Consumo promedio**: 40 m³/mes
- **Medidor**: MED-001

### 📈 **Lecturas de Pedro Martínez (cliente)**
- **2 lecturas completadas** (junio 2025)
- **Consumo variable**: 25-50 m³
- **Medidor**: MED-002

### 📋 **Lecturas de Carmen Silva (cliente)**
- **1 lectura familiar** (junio 2025)
- **Consumo alto**: 45 m³ (familia numerosa)
- **Medidor**: MED-003

### 🔍 **Características de las Lecturas**
- **Estados**: Completada, Pendiente, Error
- **Información completa**: Fecha, hora, lecturas anterior/actual, consumo
- **ID del Medidor**: Identificación única del medidor de agua
- **Observaciones**: Notas técnicas y comentarios del personal
- **Histórico**: Seguimiento temporal del consumo
- **Vista por Rol**: Columnas dinámicas según el tipo de usuario

### 👀 **Visualización por Roles**

#### **Clientes** (Vista Personal)
- **Columnas**: Fecha, Medidor, Lectura Anterior, Lectura Actual, Consumo, Observaciones, Estado
- **Datos**: Solo sus propias lecturas
- **Sin información de usuario**: No necesaria ya que son sus datos

#### **Personal** (Admin/Funcionario/Técnico)
- **Columnas**: Fecha, Usuario, Medidor, Lectura Anterior, Lectura Actual, Consumo, Observaciones, Estado
- **Datos**: Todas las lecturas del sistema
- **Información completa**: Incluye nombre del cliente para cada lectura

---

## 📱 **Acceso a Lecturas**

### **Como Cliente**:
1. Iniciar sesión con cualquier cuenta de cliente
2. Ir a "Lecturas" desde el dashboard o menú
3. Ver solo sus propias lecturas históricas

### **Como Personal (Admin/Funcionario/Técnico)**:
1. Iniciar sesión con cuenta de staff
2. Acceder a "Lecturas" para ver todas las lecturas
3. Registrar nuevas lecturas para clientes

## �� Sistema de Roles

- **Administrador**: Gestión completa del sistema
- **Funcionario**: Gestión operativa y reportes
- **Técnico**: Mantenimiento y lecturas técnicas
- **Cliente**: Acceso a información personal

---

## 🧪 Testing

### ✅ Suite de Tests Implementada

El sistema cuenta con una completa suite de tests unitarios para garantizar la calidad y funcionamiento correcto de los componentes principales.

### 📋 Tests de NavbarComponent (15 tests)

**Ubicación**: `src/app/components/navbar/navbar.component.spec.ts`

**Cobertura de funcionalidades:**
- ✅ **Creación del componente**: Verificación de inicialización correcta
- ✅ **Navegación**: Tests para todos los métodos de navegación (login, register, dashboard, perfil, lecturas, gestión de usuarios)
- ✅ **Autenticación**: Verificación del método logout y detección de usuarios admin
- ✅ **Comportamiento responsive**: Tests para detección de dispositivos móviles/desktop
- ✅ **Gestión de roles**: Verificación de nombres de roles correctos

**Tests específicos:**
```typescript
describe('NavbarComponent', () => {
  // Navegación
  it('debería navegar al login')
  it('debería navegar al register')
  it('debería navegar al dashboard')
  it('debería navegar al perfil')
  it('debería navegar a lecturas')
  it('debería navegar a gestión de usuarios')
  
  // Autenticación
  it('debería llamar al método logout del servicio')
  it('debería detectar si el usuario es admin')
  
  // Responsive
  it('debería detectar dispositivos móviles')
  it('debería detectar dispositivos desktop')
  
  // Roles
  it('debería retornar nombres de rol correctos')
})
```

### 🔐 Tests de LoginComponent (20 tests)

**Ubicación**: `src/app/features/auth/login/login.component.spec.ts`

**Cobertura de funcionalidades:**
- ✅ **Creación del componente**: Inicialización y configuración del formulario
- ✅ **Validación del formulario**: Tests para validaciones de email y contraseña
- ✅ **Login exitoso**: Flujo completo de autenticación exitosa
- ✅ **Login fallido**: Manejo de errores de autenticación
- ✅ **Validación durante submit**: Verificación de campos obligatorios
- ✅ **Visibilidad de contraseña**: Toggle de mostrar/ocultar contraseña
- ✅ **Navegación**: Redirección después del login y navegación a otras páginas
- ✅ **Manejo de errores**: Gestión de errores del formulario

**Tests específicos:**
```typescript
describe('LoginComponent', () => {
  // Formulario
  it('debería crear el formulario con validaciones')
  it('debería ser inválido cuando los campos están vacíos')
  it('debería ser válido con datos correctos')
  
  // Login exitoso
  it('debería hacer login y navegar al dashboard')
  it('debería mostrar mensaje de bienvenida')
  
  // Login fallido
  it('debería manejar error de credenciales inválidas')
  it('debería mostrar mensaje de error')
  
  // Visibilidad contraseña
  it('debería alternar la visibilidad de la contraseña')
  
  // Navegación
  it('debería navegar al registro')
  it('debería navegar a recuperar contraseña')
})
```

### 🚀 Ejecutar Tests

#### **Ejecución Completa (35 tests)**
```bash
# Tests en modo watch (desarrollo)
npm test

# Tests una sola vez
npm test -- --no-watch --no-progress --browsers=ChromeHeadless

# Tests con coverage
ng test --code-coverage
```

#### **Ejecución de Tests Específicos**
```bash
# Solo tests de Navbar
ng test --include="**/navbar.component.spec.ts"

# Solo tests de Login
ng test --include="**/login.component.spec.ts"

# Tests con patrón específico
ng test --include="**/auth/**/*.spec.ts"
```

#### **Resultados Esperados**
```
✅ TOTAL: 35 SUCCESS
├── NavbarComponent: 15 tests ✅
├── LoginComponent: 20 tests ✅
└── Otros componentes: En desarrollo 🚧
```

### 🔧 Configuración de Tests

**Framework**: Jasmine + Karma
**Browser**: Chrome Headless (CI/CD) / Chrome (desarrollo)
**Cobertura**: Disponible con `--code-coverage`

**Servicios mockeados:**
- `AuthService`: Autenticación y gestión de usuarios
- `Router`: Navegación entre páginas
- `ValidationService`: Validaciones de formularios
- `NotificationService`: Sistema de notificaciones
- `BreakpointObserver`: Detección responsive

### 📊 Métricas de Calidad

- **✅ 35/35 tests pasando** (100% success rate)
- **🔧 Mocks configurados** para todos los servicios
- **📱 Tests responsive** para diferentes dispositivos
- **🛡️ Tests de seguridad** para autenticación
- **🔄 Tests de navegación** para flujos de usuario

---

## 🏗️ Arquitectura del Proyecto

### **Estructura de Directorios**
```
src/
├── app/
│   ├── components/         # Componentes reutilizables
│   │   ├── action-button/
│   │   ├── feature-card/
│   │   ├── navbar/
│   │   └── page-header/
│   ├── core/              # Servicios core, guards, modelos
│   │   ├── guards/        # Guards de autenticación
│   │   ├── models/        # Interfaces y tipos
│   │   └── services/      # Servicios principales
│   ├── features/          # Módulos de funcionalidades
│   │   ├── auth/          # Autenticación (login, register, forgot-password)
│   │   ├── dashboard/     # Panel principal
│   │   ├── admin/         # Funciones administrativas
│   │   ├── meters/        # Gestión de medidores
│   │   └── public/        # Páginas públicas
│   └── shared/            # Componentes y utilidades compartidas
├── assets/                # Recursos estáticos
└── styles.scss           # Estilos globales y tema
```

### **Componentes Principales**

#### **🔄 Componentes Reutilizables**
- **ActionButtonComponent**: Botón personalizable con estados y animaciones
- **FeatureCardComponent**: Tarjeta para mostrar características del dashboard
- **NavbarComponent**: Barra de navegación con menú contextual por roles
- **PageHeaderComponent**: Encabezado estándar con título, subtítulo y botón volver

#### **📱 Páginas Principales**
- **HomeComponent**: Página de inicio con información del sistema
- **DashboardComponent**: Panel principal personalizado por rol
- **LoginComponent**: Autenticación con validaciones avanzadas
- **RegisterComponent**: Registro público y administrativo
- **ProfileComponent**: Gestión de perfil personal
- **ReadingsComponent**: Gestión completa de lecturas de medidores
- **UserManagementComponent**: Administración CRUD de usuarios
- **MyMetersComponent**: Gestión de medidores para clientes
- **MeterManagementComponent**: Administración de solicitudes de medidores

### **⚙️ Servicios Core**

#### **🔐 AuthService**
- Login/logout con persistencia en localStorage
- Verificación de roles y permisos
- Guards de autenticación para rutas protegidas

#### **👥 UserManagementService** 
- CRUD completo de usuarios
- Validación de datos únicos (email, teléfono)
- Gestión de roles y permisos

#### **✅ ValidationService**
- Validación de teléfonos chilenos (+56 9 XXXX XXXX)
- Validación de contraseñas seguras (8+ caracteres, mayúscula, número)
- Validaciones personalizadas para formularios reactivos

#### **🔔 NotificationService**
- Sistema centralizado de notificaciones
- Múltiples tipos: éxito, error, advertencia, información, carga
- Posicionamiento en esquina superior derecha

#### **🔧 MeterManagementService**
- Gestión de solicitudes de medidores
- Estados: Pendiente, Aprobada, Rechazada
- Persistencia completa en localStorage

---

## 📄 Fuentes de Datos JSON

El sistema obtiene datos iniciales a través de endpoints JSON públicos:

### **🔗 URLs de Datos**
- **Usuarios**: [https://dimmox.github.io/mi_apr_ng/json_data/users.json](https://dimmox.github.io/mi_apr_ng/json_data/users.json)
- **Lecturas**: [https://dimmox.github.io/mi_apr_ng/json_data/readings.json](https://dimmox.github.io/mi_apr_ng/json_data/readings.json)
- **Medidores**: [https://dimmox.github.io/mi_apr_ng/json_data/meters.json](https://dimmox.github.io/mi_apr_ng/json_data/meters.json)

*Estos endpoints proporcionan los datos de prueba iniciales que se cargan automáticamente al inicializar la aplicación.*

---

**Desarrollado con Angular 17 y Angular Material**
