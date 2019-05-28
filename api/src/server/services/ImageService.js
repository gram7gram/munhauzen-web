const Image = require('../../database/model/Image').Image;

const ImageService = (function () {

  function Service() {}

  Service.prototype.create = async function (content) {

    const entity = new Image()

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

module.exports = ImageService;

