# Tercera pre entrega del Proyecto Final - Coderhouse/Backend

Este repositorio contiene la tercera pre entrega del proyecto final con las siguientes características:

## Objetivos generales

- Profesionalización del servidor

## Objetivos específicos

- Aplicación de una arquitectura profesional en el servidor . Arquitectura SOA (Service Oriented Architecture).

- El proyecto se encuentra separado por capas.

- Aplicación de patrones de diseño, mailing y variables de entorno.

- El proyecto cuenta con DAO de archivos y DAO de memoria solo para el testing de Factory. También cuenta con DAO de MongoDB el cual es completamente funcional.

- Los endpoints se encuentran protegidos por roles.

- El carrito sólo compra los productos en stock. El ticket se genera con los datos de compra.

- Envío de correos y SMS.

## Aspectos incluidos:

### Factory / DAO y DTO

- Conceptos de Factory, DAO y DTO aplicados a la capa de persistencia.

- El DAO seleccionado por un parámetro en línea de comandos es devuelto por una Factory para que la capa de negocio opere con él.

Formato de comandos

```bash
node indexedDB.js -m <nombre_de_la_variable_de_entorno> -p <nombre_de_la_variable_de_persistencia>
```

Ejemplos de comandos para para inicializar el proyecto con diferentes variables de entorno y capas de persistencia

```bash
node index.js -m development -p MONGO
```

```bash
node index.js -m production -p MEMORY
```

```bash
node index.js -m staging -p FILESYSTEM
```

### Repository

- Implementación del patrón Repository que trabaja con el DAO en la lógica de negocio.

<small>Directorio de referencia del patrón Repository</small>

- `/src/repositories`

### Ruta /current

- DTO del usuario enviado solo con la informacion necesaria del usuario para evitar el envío de información sensible.

<small>Directorio de referencia de la ruta /current:</small>

- `/src/repositories/users.repository.js`

### Middleware de autorización

Implementación de un sistema de autorización que delimita el acceso en los siguientes endpoints:

<small>Directorio de referencia del middleware de autorización </small>

`/src/routes/router.js`

Características del middleware de autorización:

- Sólo el administrador puede crear, actualizar y
  eliminar productos.

  <small>Directorios de referencia del role ADMIN en productos:</small>

  `/src/components/handlebars/index.js`

  `/src/components/products/index.js`

- Sólo el usuario puede enviar mensajes al chat.

  <small>Directorios de referencia del role User en chat:</small>

  `/src/components/handlebars/index.js`

  `/src/components/messages/index.js`

- Sólo el usuario puede agregar productos al carrito.

  <small>Directorios de referencia del role User en carrito:</small>

  `/src/components/handlebars/index.js`

  `/src/components/carts/index.js`

### Modelo Ticket

Implementación del modelo Ticket el cual cuenta con todas las formalizaciones de la compra y con los siguientes campos:

- Id: autogenerado por mongo

- code: String debe autogenerarse y ser único

- purchase_datetime: Guarda la fecha y hora en la cual se formalizó la compra.

- amount: Number, total de la compra.

- purchaser: String, contiene el correo del usuario asociado al carrito.

  <small>Directorio del Modelo Ticket:</small>

  `/src/models/tickets.js`

### Router de Carts | Ruta /:cid/purchase

Ruta que permite finalizar el proceso de compra de dicho carrito con las siguientes características:

- La compra corrobora el stock del producto al momento de finalizarse.
  - Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito,lo resta del stock del producto y continua.
  - Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, no agrega el producto al proceso de compra.
  - Al final, se utiliza el servicio de Tickets para generar un ticket con los datos de la compra.
  - En caso de existir una compra no completada, devuelve el arreglo con los ids de los productos que no pudieron procesarse.
  - Una vez finalizada la compra, el carrito asociado al usuario que compró contiene sólo los productos que no pudieron comprarse. Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.

<small>Directorios de la ruta /:cid/purchase </small>

`/src/components/carts/index.js`
`/src/components/carts/cartsServices/cartsServices.js`
`/src/components/carts/cartsController/cartsController.js`

### Envío de correos | Router de Carts | Ruta /:cid/purchasecart | Implementación del lado del cliente

En la ruta /:cid/purchasecart se implementó el envío de un correo por medio de la función purchaseCartMail desde el cliente.

## Ver video

La información que incluye el correo es la siguiente:

- Ticket Code: Un código único asociado a la compra.

- Username: El correo de usuario del comprador. Este valor se obtiene del token JWT si está presente y decodificado con éxito, o de la sesión del usuario si no se proporciona un token válido.

- Total Products: El número total de productos en el carrito de compras.

- Products Purchased: El número de productos que se pudieron comprar con éxito. Esto es igual al número total de productos menos la cantidad de productos que no pudieron ser comprados debido a la falta de stock.

- Products Not Purchased: El número de productos que no se pudieron comprar debido a la falta de stock. Estos son los productos que se agregaron a la lista productsNotPurchased.

- Productos Comprados: Una lista de los productos comprados, junto con la cantidad de cada uno. Esta lista se genera a partir de la información en productsToPurchase.

<small>Directorios de la ruta /:cid/purchasecart </small>

`/src/components/carts/index.js`
`/src/components/carts/cartsServices/cartsServices.js`
`/src/components/carts/cartsController/cartsController.js`

### Configuración de Variables de Entorno (.env)

- La información delicada está almacenada en un archivo .env. Permite acceder a estos datos a través de variables de entorno, mejorando la seguridad y organización de nuestra aplicación.

## Requisitos

Asegúrate de tener los siguientes requisitos instalados en tu entorno de desarrollo:

- Node.js
- MongoDB

## Instrucciones de instalación

Sigue estos pasos para instalar y configurar el proyecto:

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/lisandrojm/desafio_reestructura-de-nuestro-servidor
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd desafio_reestructura-de-nuestro-servidor
   ```

3. Instala las dependencias del proyecto ejecutando el siguiente comando:

   ```bash
   npm install
   ```

4. Configura la conexión a la base de datos MongoDB y todas las variables de entorno en el archivo `.env`. Puedes copiar el archivo `.env.example` y renombrarlo a `.env`, luego actualiza los valores con tu configuración:

   ```bash
   cp .env.example .env
   ```

   Asegúrate de tener MongoDB en ejecución , la URL de conexión correcta y todas las variables de entorno configuradas en el archivo `.env`.

5. Inicia la aplicación con el siguiente comando:

   ```bash
   npm start
   ```

   Esto iniciará el servidor Node.js y estará escuchando en el puerto especificado en el archivo `.env`.

6. Accede a la aplicación en tu navegador web ingresando la siguiente URL:

   ```
   http://localhost:<PUERTO_DE_LA_APP>
   ```

   Asegúrate de reemplazar `<PUERTO_DE_LA_APP>` con el número de puerto especificado en el archivo `.env`.

7. Ahora podrás utilizar la vista de Login en la aplicación.

## Credenciales de Admin para testing de roles de usuario:

### Email:

```
adminCoder@coder.com
```

### Password:

```
adminCod3r123
```

## Video Testing

## Estructura general del proyecto (directorios relevantes para el desafío)

Aquí tienes la estructura del proyecto con descripciones para cada directorio:

El proyecto sigue la siguiente estructura de directorios:

- `/.env`: Variables de entorno.

- `/.env.example`: Archivo de ejemplo que muestra la estructura y variables de entorno requeridas para la configuración de la aplicación.

- `/src/components`: Carpeta contenedora de todos los componentes. Cada componente contiene un archivo index.js con sus rutas, una carpeta de controlador y una de servicios.

- `/src/config`: Archivos de configuración de la aplicación.

  - `/src/config/index.js`: Exporta variables de entorno y configuraciones generales.
  - `/src/config/mongo.js`: Configuración de Mongoose para establecer la conexión a la base de datos MongoDB.
  - `/src/config/passport.js`: Configuración de Passport para generar las estrategias de autenticación y autorización.

- `/src/models`: Modelos de datos de la aplicación.

- `/src/public`: Archivos públicos de la aplicación, como estilos CSS, imágenes y scripts JavaScript.

- `/src/routes`: Archivos de definición de rutas de la aplicación.

- `/src/utils`: Archivos relacionados con la configuración de las utilidades reutilizables.

- `/src/views`: Todas las vistas del proyecto.

## Dependencias

El proyecto utiliza las siguientes dependencias:

- **Express.js (v4.18.2):** Framework de Node.js para construir aplicaciones web.
- **UUID (v9.0.0):** Biblioteca para generar identificadores únicos.
- **Cors (v2.8.5):** Middleware para permitir peticiones HTTP entre diferentes dominios.
- **Dotenv (v16.3.1):** Carga variables de entorno desde un archivo .env.
- **Express-handlebars (v7.0.7):** Motor de plantillas para Express.js.
- **MongoDB (v5.6.0):** Driver de MongoDB para Node.js.
- **Mongoose (v7.3.1):** Modelado de objetos de MongoDB para Node.js.
- **Multer (v1.4.5-lts.1):** Middleware para manejar datos de formulario multipart/form-data.
- **Socket.io (v4.6.2):** Biblioteca para la comunicación en tiempo real basada en WebSockets.
- **Sweetalert2 (v11.7.12):** Biblioteca para mostrar mensajes y alertas personalizadas.
- **Connect-mongo (v5.0.0):** Middleware para almacenar sesiones de Express.js en MongoDB.
- **Cookie-parser (v1.4.6):** Middleware para analizar cookies en las solicitudes de Express.js.
- **Express-session (v1.17.3):** Middleware para manejar sesiones en Express.js.
- **Mongoose-paginate-v2 (v1.7.1):** Plugin de paginación para Mongoose.
- **Bcrypt (v5.1.0):** Biblioteca para el hashing seguro de contraseñas.
- **Passport (v0.6.0):** Middleware para autenticación en Node.js.
- **Passport-github2 (v0.1.12):** Estrategia de autenticación para Passport usando OAuth 2.0 con GitHub.
- **Passport-local (v1.0.0):** Estrategia de autenticación para Passport basada en credenciales locales.
- **Jsonwebtoken (v9.0.1):** Biblioteca para generar y verificar tokens JWT.
- **Passport-jwt (v4.0.1):** Estrategia de autenticación para Passport que utiliza tokens JWT (JSON Web Tokens) para la autenticación de usuarios.
- **Commander (v11.0.0):** Biblioteca para crear interfaces de línea de comandos interactivas en Node.js.
- **Twilio (v4.16.0):** Biblioteca para enviar y recibir mensajes de texto y realizar llamadas telefónicas a través de la API de Twilio.
- **Nodemailer (v6.9.4):** Biblioteca para enviar correos electrónicos desde una aplicación Node.js.
- **Faker (v5.5.3):** Biblioteca para generar datos falsos como nombres, direcciones, correos electrónicos, etc., útil para pruebas y desarrollo.

## DevDependencies

El proyecto utiliza las siguientes devDependencies:

- Nodemon (v2.0.22): Utilidad que monitoriza cambios en los archivos y reinicia automáticamente la aplicación.

Estas dependencias pueden ser instaladas ejecutando el comando `npm install` en el directorio del proyecto.

## Postman Collections

- En la carpeta `postman_collections`, encontrarás los archivos necesarios para importar las colecciones en Postman y realizar pruebas en el proyecto. Las colecciones proporcionan ejemplos de solicitudes HTTP para interactuar con la API y probar su funcionalidad.

- Importante: Como el proyecto cuenta con un Middleware de autorización hay que realizar los siguientes pasos en Postman:

  1.0 - Ir a Postman/Headers/Cookies/Manage Cookies

  2.0 - Type a domain name:localhost

  3.0 - Template: Cookie_5=value; Path=/; Expires=Sun, 01 Sep 2024 22:47:37 GMT;

  3.1 - Loguearse como Admin o como User según corresponda para testear la ruta

  3.2 - Una vez logueado ingresar a Application/Cookies/http://localhost:8080 y copiar el value del token jwt.

  3.3 - En el Template de la cookie de Postman reemplazar Cookie_5 por jwt y value por el value del token copiado.

  3.4 - Debe quedar un código como el siguiente (el token a continuación es un ejemplo):

  jwt=ey123456789wolrtjlwkjt.eyJfaWQiOiI2NGY3YzBkY2ZmMzY2NmQ4YTdjMDA0MDciLCJlbWFpbCI6InVzZXJAY29ycmVvLmNvbSIsInJvbGUiOiJhZG1pbiIsImZpcnN0X25hbWUiOiJ1c2VyIiwibGFzdF9uYW1lIjoidXNlciIsImFnZSI6MzMsImNhcnQiOiI2NGY3YzBkY2ZmMzY2NmQ4YTdjMDA0MDkiLCJpYXQiOjE2OTQwNTU5OTgsImV4cCI6MTY5NDE0MjM5OH0.hIYn2frVQCVNBMGI5E4sRkTqCTBhSHQ0Th0uSOUtabc; Path=/; Expires=Fri, 06 Sep 2024 03:12:07 GMT;

  3.5 - Tener en cuenta que los token de las cookies expiran por lo que para realizar varios tests hay que loguearse y volver a copiar el token
