const AudioFail = require('../../database/model/AudioFail').AudioFail;

const AudioFailService = (function () {

  function Service() {}

  Service.prototype.create = function (content) {

    const entity = new AudioFail()

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

module.exports = AudioFailService;

