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
      zlib: {level: 5}
    });

    archive.on('error', function (err) {

      logger.error(err)

      throw err;
    })

    const audio = await this.prepareAudio()
    if (audio.length === 0) {
      throw 'Missing audio'
    }

    const fails = await this.prepareAudioFails()
    if (fails.length === 0) {
      throw 'Missing fails'
    }

    const chapters = await this.prepareChapters()
    if (chapters.length === 0) {
      throw 'Missing chapters'
    }

    const scenario = await this.prepareScenario()
    if (scenario.length === 0) {
      throw 'Missing scenario'
    }

    const inventory = await this.prepareInventory()
    if (inventory.length === 0) {
      throw 'Missing inventory'
    }

    const images = await this.prepareImages()
    if (images.length === 0) {
      throw 'Missing images'
    }

    archive.append(JSON.stringify(audio), {name: 'audio.json'})
    archive.append(JSON.stringify(fails), {name: 'audio-fails.json'})
    archive.append(JSON.stringify(chapters), {name: 'chapters.json'})
    archive.append(JSON.stringify(scenario), {name: 'scenario.json'})
    archive.append(JSON.stringify(inventory), {name: 'inventory.json'})
    archive.append(JSON.stringify(images), {name: 'images.json'})

    const fileName = `/downloads/game-${parameters.version}.zip`

    archive.pipe(fs.createWriteStream(publicDir + fileName));

    await archive.finalize();

    return {
      url: parameters.host + fileName,
      summary: {
        audio: audio.length,
        fails: fails.length,
        chapters: chapters.length,
        scenario: scenario.length,
        inventory: inventory.length,
        images: images.length,
      }
    }
  }

  Service.prototype.prepareAudioFails = async function () {
    const items = await AudioFail.find().sort({name: 'asc'}).lean()

    return items
  }

  Service.prototype.prepareChapters = async function () {
    const items = await Chapter.find().sort({name: 'asc'}).lean()

    return items
  }

  Service.prototype.prepareScenario = async function () {
    const items = await Scenario.find({isReserved: {$ne: true}}).sort({name: 'asc'}).lean()

    return items
  }

  Service.prototype.prepareInventory = async function () {
    const items = await Inventory.find().sort({name: 'asc'}).lean()

    return items
  }

  Service.prototype.prepareImages = async function () {
    const items = await Image.find({isReserved: {$ne: true}}).sort({order: 'asc', name: 'asc'}).lean()

    return items
  }

  Service.prototype.prepareAudio = async function () {
    const items = await Audio.find().sort({name: 'asc'}).lean()

    return items
  }

  return new Service();
})()

module.exports = ExportService;

