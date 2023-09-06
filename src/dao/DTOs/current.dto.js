/* ************************************************************************** */
/* /src/dao/DTOs/current.dto.js - configuración de variables de entorno */
/* ************************************************************************** */

class CurrentDTO {
  constructor(user) {
    this.email = user.email || '';
    this.role = user.role || 'user';
  }
}

module.exports = CurrentDTO;
