const Audio = require('../../database/model/Audio').Audio;

const AudioService = (function () {

  function Service() {}

  Service.prototype.create = async function (content) {

    const entity = new Audio()

    await this.update(entity, content)

    return entity.toObject()
  }

  Service.prototype.update = async function (entity, content) {

    entity.set(content)

    const validator = await entity.validate();
    if (validator) {
      throw {
        code: 400,
        message: 'bad request',
        errors: validator.errors
      }
    }

    await entity.save()
  }

  return new Service();
})()

module.exports = AudioService;

