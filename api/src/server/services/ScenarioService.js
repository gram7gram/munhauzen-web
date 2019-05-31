const logger = require('../../logger');
const Scenario = require('../../database/model/Scenario').Scenario;

const ScenarioService = (function () {

  function Service() {}

  Service.prototype.restoreDefaults = async function () {

    try {

      const content = {
        name: 'VICTORY',
        isReserved: true
      }

      await Scenario.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: false
      })

    } catch (e) {
      logger.error(e);
    }

    try {

      const content = {
        name: 'DEFEAT',
        isReserved: true
      }

      await Scenario.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: false
      })

    } catch (e) {
      logger.error(e);
    }
  }

  Service.prototype.create = async function (content) {

    const entity = new Scenario()

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

    content = await entity.save()

    if (content.isBegin) {
      await Scenario.updateMany({_id: {$ne: content._id}}, {isBegin: false})
    }
  }

  return new Service();
})()

module.exports = ScenarioService;

