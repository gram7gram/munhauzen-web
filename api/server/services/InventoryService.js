const Inventory = require('../../database/model/Inventory').Inventory;

const InventoryService = (function () {

  function Service() {}

  Service.prototype.create = function (content) {

    const entity = new Inventory()

    this.update(entity, content)

    return entity.toObject()
  }

  Service.prototype.update = function (entity, content) {

    entity.set(content)

    const validator = entity.validateSync();
    if (validator) {
      throw {
        code: 400,
        message: 'bad request',
        errors: validator.errors
      }
    }

    entity.save()
  }

  return new Service();
})()

module.exports = InventoryService;

