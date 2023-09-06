/* ************************************************************************** */
/* /src/components/handlebars/index.js - Contiene las rutas y controladores de los
 de handlebarsController.js. */
/* ************************************************************************** */

/* Comentado por ser reemplazado por handelePolicies */
/* const passportCall = require('../../utils/passport/passportCall');
 const { authorization } = require('../../utils/auth/auth'); */

const CustomRouter = require('../../routes/router');
const handlebarsController = require('./handlebarsController/handlebarsController');
const { validateCartId } = require('../../utils/routes/routerParams');

class HandlebarsRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware para manejar los parámetros cid y pid
    this.router.param('cid', validateCartId);

    /* ************************************************************************************ */
    /* VIEWS */
    /* ************************************************************************************ */

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    /* ************************************************************************************ */
    /* Public */
    /* ************************************************************************************ */
    this.get('/', ['PUBLIC'], handlebarsController.getLogin);
    this.get('/register', ['PUBLIC'], handlebarsController.getRegister);
    this.get('/recovery', ['PUBLIC'], handlebarsController.getRecovery);

    /* ************************************************************************************ */
    /* User */
    /* ************************************************************************************ */
    /* Sólo el USER puede agregar productos a su carrito carrito. */
    this.get('/products', ['USER'], handlebarsController.getProducts);
    this.get('/carts/:cid', ['USER'], handlebarsController.getCartProductById);
    /* Sólo el USER puede acceder al perfil de usuario. */
    this.get('/user', ['USER'], handlebarsController.getUser);
    /* Sólo el USER puede enviar mensajes al chat. */
    this.get('/chat', ['USER'], handlebarsController.getChat);

    /* ************************************************************************************ */
    /* Admin */
    /* ************************************************************************************ */
    this.get('/admin', ['ADMIN'], handlebarsController.getAdmin);
    /* Sólo el ADMIN puede crear, actualizar y eliminar productos. */
    this.get('/admin/products', ['ADMIN'], handlebarsController.getAdminProducts);

    /* //////////////////////////////////// */
    /* Views de otros desafíos */
    this.get('/realtimeproducts', ['ADMIN'], handlebarsController.getRealTimeProducts);
    this.get('/home', ['ADMIN'], handlebarsController.getHomeProducts);

    /* ************************************************************************************ */
    /* USER/ADMIN */
    /* ************************************************************************************ */
    this.get('/current', ['USER', 'ADMIN'], handlebarsController.getCurrent);
  }
}

module.exports = new HandlebarsRoutes();
