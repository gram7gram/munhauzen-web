const Chapter = require('../../database/model/Chapter').Chapter;

const ChapterService = (function () {

  function Service() {}

  Service.prototype.create = async function (content) {

    const entity = new Chapter()

    await this.update(entity, content)

    return entity.toObject()
  }

  Service.prototype.update = async function (entity, content) {

    entity.set(content)

    const validator = entity.validateSync();
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

module.exports = ChapterService;

