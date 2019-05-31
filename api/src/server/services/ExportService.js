const fs = require('fs');
const path = require('path');
const logger = require('../../logger');
const archiver = require('archiver');
const parameters = require('../../../parameters');

const Image = require('../../database/model/Image').Image;
const Audio = require('../../database/model/Audio').Audio;
const AudioFail = require('../../database/model/AudioFail').AudioFail;
const Chapter = require('../../database/model/Chapter').Chapter;
const Scenario = require('../../database/model/Scenario').Scenario;
const Inventory = require('../../database/model/Inventory').Inventory;

const publicDir = path.resolve(__dirname, '../../../public')

const ExportService = (function () {

  function Service() {
  }

  Service.prototype.generateArchive = async function () {

    const archive = archiver('zip', {
      zlib: {level: 9}
    });

    archive.on('error', function (err) {

      logger.error(err)

      throw err;
    })

    archive.append(await this.prepareAudio(), {name: 'audio.json'})
    archive.append(await this.prepareAudioFails(), {name: 'audio-fails.json'})
    archive.append(await this.prepareChapters(), {name: 'chapters.json'})
    archive.append(await this.prepareScenario(), {name: 'scenario.json'})
    archive.append(await this.prepareInventory(), {name: 'inventory.json'})
    archive.append(await this.prepareImages(), {name: 'images.json'})

    const fileName = '/downloads/game.zip'

    archive.pipe(fs.createWriteStream(publicDir + fileName));

    archive.finalize();

    return {
      url: parameters.host + fileName
    }
  }

  Service.prototype.prepareAudioFails = async function () {
    const items = await AudioFail.find().sort({name: 'asc'}).lean()

    return JSON.stringify(items)
  }

  Service.prototype.prepareChapters = async function () {
    const items = await Chapter.find().sort({name: 'asc'}).lean()

    return JSON.stringify(items)
  }

  Service.prototype.prepareScenario = async function () {
    const items = await Scenario.find({isReserved: {$ne: true}}).sort({name: 'asc'}).lean()

    return JSON.stringify(items)
  }

  Service.prototype.prepareInventory = async function () {
    const items = await Inventory.find().sort({name: 'asc'}).lean()

    return JSON.stringify(items)
  }

  Service.prototype.prepareImages = async function () {
    const items = await Image.find({isReserved: {$ne: true}}).sort({name: 'asc'}).lean()

    return JSON.stringify(items)
  }

  Service.prototype.prepareAudio = async function () {
    const items = await Audio.find().sort({name: 'asc'}).lean()

    return JSON.stringify(items)
  }

  return new Service();
})()

module.exports = ExportService;

