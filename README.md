# Aplicación de Gestión de Onboarding

Esta **Aplicación de Gestión de Onboarding** es una solución web integral diseñada para administrar eficientemente los procesos de incorporación de empleados. Proporciona un entorno moderno y adaptable para el seguimiento de nuevas contrataciones, la asignación de tareas de onboarding y la facilitación de una integración fluida en la organización.

## 1. Puesta en Marcha

Siga estos pasos para configurar y ejecutar la aplicación en su entorno local.

### 1. Clonar el Repositorio:

Si ha obtenido el código fuente a través de un repositorio Git, clónelo en su máquina local. Reemplace la URL con la de su repositorio.

```bash
git clone https://github.com/Porcelanic/App-de-gestion-de-Onboarding-Bbg.git
```

### 2. Navegar al Directorio del Proyecto:

Acceda a la carpeta raíz del proyecto que acaba de clonar o descomprimir.

```bash
cd App-de-gestion-de-Onboarding-Bbg
```

### 3. Configuración de Variables de Entorno:

Es crucial configurar las variables de entorno para el correcto funcionamiento tanto del backend como del frontend.

Cree un archivo `.env` en la carpeta `backend` y otro en la carpeta `frontend`. Utilice los archivos `.env.example` como plantilla y defina las variables necesarias para la conexión a la base de datos, claves secretas, y otras configuraciones específicas del entorno.

### 4. Configuración de la Base de Datos:

Asegúrese de tener una instancia de PostgreSQL en ejecución. Cree una base de datos con el nombre que haya especificado en las variables de entorno del backend. La aplicación utilizará las credenciales proporcionadas en el archivo `.env` del backend para conectarse automáticamente. No se requieren configuraciones manuales adicionales en la base de datos más allá de su creación.

### 5. Iniciar la Aplicación:

Deberá iniciar los servicios del backend y del frontend por separado.

#### Iniciar el Backend:

Navegue al directorio del backend, instale las dependencias y ejecute el servidor de desarrollo:

```bash
cd backend
npm install
npm run dev
```

#### Iniciar el Frontend:

En otra terminal, navegue al directorio del frontend, instale las dependencias y ejecute la aplicación de desarrollo:

```bash
cd frontend
npm install
npm run dev
```

### 6. Ejecutar Pruebas (Opcional):

Para verificar la integridad del código, puede ejecutar las pruebas automatizadas en sus respectivas carpetas (frontend y backend):

```bash
# Desde la carpeta 'backend' o 'frontend'
npm test
```

### 7. Acceder a la Aplicación:

Una vez que tanto el backend como el frontend estén en ejecución, abra su navegador web y diríjase a la dirección donde se está ejecutando el frontend (generalmente `http://localhost:5173` o la que indique la salida de `npm run dev` del frontend).

## 2. Previsualizacion

Puedes ver un demo de la aplicacion en el siguiente enlace: https://drive.google.com/file/d/1DGlXQF1CXpP1VFQaTvE2pYIHLixvNeAz/view?usp=sharing

Tambien puedes ver la aplicacion desplegada en este enlace: https://app-de-gestion-de-onboarding-bbg.vercel.app/login
