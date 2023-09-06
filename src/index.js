/* ************************************************************************** */
/* /src/index.js - Punto de entrada principal para la ejecución de la aplicación */
/* ************************************************************************** */

const express = require('express');
const cors = require('cors');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const SocketConfig = require('./utils/sockets/socket.io'); /* Importar la clase SocketConfig */
const { config } = require('./config');
const { db } = require('./config');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const PORT = `${config.port}` || 3001;
const passport = require('passport');
const initializePassport = require('./config/passport');
/* Inicializar factory */
const Dao = require('./dao/factory');
/* faker products */
const { generateFakeProducts } = require('./scripts/generateFakerProducts');

class Server {
  constructor() {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.views();
    this.socket();
  }

  settings() {
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );
    this.app.use(express.static(path.join(__dirname, '/public')));
  }

  routes() {
    routes(this.app);
  }

  views() {
    const handlebars = expressHandlebars.create({
      defaultLayout: 'main',
    });
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.engine('handlebars', handlebars.engine);
    this.app.set('view engine', 'handlebars');
  }

  middlewares() {
    this.app.use(cors('*'));
    this.app.use(cookieParser(`${config.cookie_key}`));
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl: `${db.mongo_atlas}${db.dbName}`,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
          ttl: 1800,
        }),
        secret: config.secret_key,
        resave: true,
        saveUninitialized: true,
      })
    );
    initializePassport();
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  socket() {
    const server = require('http').createServer(this.app);
    const socketConfig = new SocketConfig(server);
    this.app.io = socketConfig.io;
  }

  listen() {
    const server = this.app.listen(PORT, () => {
      console.log(`Servidor en ejecución en http://localhost:${PORT}`);
      // Crear productos con faker al iniciar
      generateFakeProducts();
    });

    this.app.io.attach(server);
  }
}

module.exports = new Server();
