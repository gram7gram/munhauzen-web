const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const parameters = require('../../../parameters');

const Image = require('../../database/model/Image').Image;
const Audio = require('../../database/model/Audio').Audio;
const AudioFail = require('../../database/model/AudioFail').AudioFail;
const Chapter = require('../../database/model/Chapter').Chapter;
const Scenario = require('../../database/model/Scenario').Scenario;
const Inventory = require('../../database/model/Inventory').Inventory;

const publicDir = path.resolve(__dirname, '../../../public')

const generateArchive = async function (locale) {

  const archive = archiver('zip', {
    zlib: {level: 5}
  });

  archive.on('error', function (err) {
    throw err;
  })

  const audio = await Audio.find({locale}).sort({name: 'asc'}).lean()
  if (audio.length === 0) {
    throw {
      code: 404,
      message: 'Не найдено аудио при генерации архива игры'
    }
  }

  const fails = await AudioFail.find({locale}).sort({order: 'asc', name: 'asc'}).lean()
  if (fails.length === 0) {
    throw {
      code: 404,
      message: 'Не найдено фейлов при генерации архива игры'
    }
  }

  const chapters = await Chapter.find({locale}).sort({name: 'asc'}).lean()
  if (chapters.length === 0) {
    throw {
      code: 404,
      message: 'Не найдено глав при генерации архива игры'
    }
  }

  const scenario = await Scenario.find({locale}).sort({name: 'asc'}).lean()
  if (scenario.length === 0) {
    throw {
      code: 404,
      message: 'Не найдено сценария при генерации архива игры'
    }
  }

  const inventory = await Inventory.find({locale}).sort({name: 'asc'}).lean()
  if (inventory.length === 0) {
    throw {
      code: 404,
      message: 'Не найдено инвентаря при генерации архива игры'
    }
  }

  const images = await Image.find({locale, isReserved: {$ne: true}}).sort({order: 'asc', name: 'asc'}).lean()
  if (images.length === 0) {
    throw {
      code: 404,
      message: 'Не найдено картинок при генерации архива игры'
    }
  }

  archive.append(JSON.stringify(audio), {name: 'audio.json'})
  archive.append(JSON.stringify(fails), {name: 'audio-fails.json'})
  archive.append(JSON.stringify(chapters), {name: 'chapters.json'})
  archive.append(JSON.stringify(scenario), {name: 'scenario.json'})
  archive.append(JSON.stringify(inventory), {name: 'inventory.json'})
  archive.append(JSON.stringify(images), {name: 'images.json'})

  const fileName = `/downloads/game-${locale}-${parameters.version}.zip`

  archive.pipe(fs.createWriteStream(publicDir + fileName));

  await archive.finalize();

  return {
    url: parameters.host + fileName,
  }
}

module.exports = {
  generateArchive
};

