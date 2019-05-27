const xlsx = require('xlsx');

const Chapter = require('../../database/model/Chapter').Chapter;
const Inventory = require('../../database/model/Inventory').Inventory;
const Audio = require('../../database/model/Audio').Audio;
const AudioFail = require('../../database/model/AudioFail').AudioFail;
const Image = require('../../database/model/Image').Image;

const audioService = require('./AudioService');
const audioFailService = require('./AudioFailService');
const inventoryService = require('./InventoryService');
const chapterService = require('./ChapterService');
const imageService = require('./ImageService');

const ImportService = (function () {

  function Service() {
  }

  Service.prototype.parse = async function (file) {

    let workbook
    try {
      workbook = xlsx.read(file.data.buffer, {type: 'buffer'})
    } catch (e) {
      throw {
        message: 'Невозможно прочитать содержимое файла',
        e
      }
    }

    const handlers = {
      'chapters': this.parseChapters.bind(this),
      'pictures': this.parseImage.bind(this),
      'audio_scenario': this.parseAudio.bind(this),
      'fails_Eng': this.parseAudioFailEn.bind(this),
      'fails_Ru': this.parseAudioFailRu.bind(this),
      'fails_Ukr': this.parseAudioFailUa.bind(this),
      'inventory (items for game)': this.parseGameInventory.bind(this),
      'global_inventory (menu)': this.parseMenuInventory.bind(this),
      'statue_inventory (statue, arch)': this.parseStatueInventory.bind(this),
    }

    let errors = await Promise.all(Object.keys(handlers).map(async name => {

      const handler = handlers[name]

      if (workbook.Sheets[name] !== undefined) {

        const result = await handler(workbook.Sheets[name])

        const currentErrors = result ? result.filter(e => e && e.message) : []

        console.log(name, currentErrors);

        if (currentErrors.length > 0) {

          return {
            sheet: name,
            errors: currentErrors
          }
        }
      }

    }))

    errors = errors.filter(e => e && e.sheet)

    return {
      hasErrors: errors.length > 0,
      errors
    }
  }

  /**
   * Header: chapter_id, icon_chapter, description_chapter_eng, description_chapter_ru, description_chapter_ua
   *
   * @param sheet
   */
  Service.prototype.parseChapters = async function (sheet) {

    const data = xlsx.utils.sheet_to_json(sheet).filter(item =>
      item.chapter_id !== undefined
      && (item.description_chapter_eng !== undefined || item.description_chapter_ru !== undefined || item.description_chapter_ua !== undefined)
    )

    if (data.length === 0) return

    return await Promise.all(data.map(async item => {

      const translations = []

      if (item.description_chapter_eng !== undefined) {
        translations.push({
          locale: 'en',
          description: item.description_chapter_eng
        })
      }

      if (item.description_chapter_ru !== undefined) {
        translations.push({
          locale: 'ru',
          description: item.description_chapter_ru
        })
      }

      if (item.description_chapter_ua !== undefined) {
        translations.push({
          locale: 'ua',
          description: item.description_chapter_ua
        })
      }

      const chapter = {
        name: item.chapter_id,
        icon: item.icon_chapter || null,
        translations
      }

      let entity = await Chapter.findOne({name: chapter.name})

      try {

        if (!entity) {
          chapterService.create(chapter)
        } else {
          chapterService.update(entity, chapter)
        }

      } catch (e) {

        return {
          message: `Глава ${chapter.name} содержит ошибки`
        }

      }
    }))
  }

  /**
   * Header: Name, Related_option
   *
   * @param sheet
   */
  Service.prototype.parseGameInventory = function (sheet) {

    const data = xlsx.utils.sheet_to_json(sheet).filter(item =>
      item.Name !== undefined
      && item.Related_option !== undefined
    )

    if (data.length === 0) return

    return Promise.all(data.map(async item => {

      let relatedScenario

      if (item.Related_option.indexOf(' or ') !== 1) {
        relatedScenario = item.Related_option.split(' or ')
          .map(item => item.trim())
          .filter(item => !!item && item !== 'Empty')
      } else {
        relatedScenario = item.Related_option.split(',')
          .map(item => item.trim())
          .filter(item => !!item && item !== 'Empty')
      }

      const content = {
        name: item.Name.trim().toUpperCase(),
        relatedScenario
      }

      let entity = await Inventory.findOne({name: content.name})

      try {

        if (!entity) {
          inventoryService.create(content)
        } else {
          inventoryService.update(entity, content)
        }

      } catch (e) {

        return {
          message: `Инвентарь ${content.name} содержит ошибки`
        }

      }
    }))
  }

  /**
   * Header: inventory_global_required, Related_option
   *
   * @param sheet
   */
  Service.prototype.parseMenuInventory = function (sheet) {

    const data = xlsx.utils.sheet_to_json(sheet).filter(item =>
      item.inventory_global_required !== undefined
      && item.Related_option !== undefined
    )

    if (data.length === 0) return

    return Promise.all(data.map(async item => {

      let relatedScenario

      if (item.Related_option.indexOf(' or ') !== 1) {
        relatedScenario = item.Related_option.split(' or ')
          .map(item => item.trim())
          .filter(item => !!item && item !== 'Empty')
      } else {
        relatedScenario = item.Related_option.split(',')
          .map(item => item.trim())
          .filter(item => !!item && item !== 'Empty')
      }

      const content = {
        name: item.inventory_global_required.trim().toUpperCase(),
        isMenu: true,
        relatedScenario
      }

      let entity = await Inventory.findOne({name: content.name})

      try {

        if (!entity) {
          inventoryService.create(content)
        } else {
          inventoryService.update(entity, content)
        }

      } catch (e) {

        return {
          message: `Инвентарь ${content.name} содержит ошибки`
        }

      }
    }))
  }

  /**
   * Header: Name, Related_option, Related_inventory, Description_Eng, Description_Ua, Description_Ru
   *
   * @param sheet
   */
  Service.prototype.parseStatueInventory = function (sheet) {

    const data = xlsx.utils.sheet_to_json(sheet).filter(item =>
      item.Name !== undefined
      && item.Related_options !== undefined
      && (item.Description_Eng !== undefined || item.Description_Ua !== undefined || item.Description_Ru !== undefined)
    )

    if (data.length === 0) return

    return Promise.all(data.map(async item => {

      let relatedScenario, relatedInventory = [], statueTranslations = []

      if (item.Related_options.indexOf(' or ') !== 1) {

        relatedScenario = item.Related_options.split(' or ')
          .map(item => item.trim())

          .filter(item => !!item && item !== 'Empty')
      } else {

        relatedScenario = item.Related_options.split(',')
          .map(item => item.trim())
          .filter(item => !!item && item !== 'Empty')

      }

      if (item.Related_inventory) {

        relatedInventory = item.Related_inventory.split(',')
          .map(item => item.replace('all inventory: ', '').trim().toUpperCase())
          .filter(item => !!item && item !== 'Empty')

      }

      if (item.Description_Eng) {
        statueTranslations.push({
          locale: 'en',
          description: item.Description_Eng
        })
      }

      if (item.Description_Ru) {
        statueTranslations.push({
          locale: 'ru',
          description: item.Description_Ru
        })
      }

      if (item.Description_Ua) {
        statueTranslations.push({
          locale: 'ua',
          description: item.Description_Ua
        })
      }

      const content = {
        name: item.Name.trim().toUpperCase(),
        isStatue: true,
        relatedScenario,
        relatedInventory,
        statueTranslations,
      }

      let entity = await Inventory.findOne({name: content.name})

      try {

        if (!entity) {
          inventoryService.create(content)
        } else {
          inventoryService.update(entity, content)
        }

      } catch (e) {

        return {
          message: `Инвентарь ${content.name} содержит ошибки`
        }

      }
    }))
  }

  /**
   * Header: Id_picture, file, type, description_picture_ua, description_picture_ru, description_picture_eng,
   * description_statue_ua, description_statue_ru, description_statue_eng, isanimation, isforbidden
   *
   * @param sheet
   */
  Service.prototype.parseImage = function (sheet) {

    const data = xlsx.utils.sheet_to_json(sheet).filter(item =>
      item.Id_picture !== undefined
      && item.file !== undefined
      && item.type !== undefined
      && item.isanimation !== undefined
      && item.isforbidden !== undefined
      && (item.description_picture_ua !== undefined || item.description_picture_ru !== undefined || item.description_picture_eng !== undefined)
    )

    if (data.length === 0) return

    return Promise.all(data.map(async item => {

      const translations = []

      if (item.description_picture_ua) {
        translations.push({
          locale: 'ua',
          description: item.description_picture_ua,
          statueTitle: item.description_statue_ua,
        })
      }

      if (item.description_picture_ru) {
        translations.push({
          locale: 'ru',
          description: item.description_picture_ru,
          statueTitle: item.description_statue_ru,
        })
      }

      if (item.description_picture_eng) {
        translations.push({
          locale: 'en',
          description: item.description_picture_eng,
          statueTitle: item.description_statue_eng,
        })
      }

      const content = {
        name: item.Id_picture.trim(),
        file: item.file.trim(),
        type: item.type.trim(),
        isAnimation: item.isanimation.toLowerCase() === 'true',
        isHiddenFromGallery: item.isforbidden.toLowerCase() === 'true',
        translations
      }

      let entity = await Image.findOne({name: content.name})

      try {

        if (!entity) {
          imageService.create(content)
        } else {
          imageService.update(entity, content)
        }

      } catch (e) {

        return {
          message: `Картинка ${content.name} содержит ошибки`
        }

      }
    }))
  }

  /**
   * Header: Id_audio, file, duration_audio
   *
   * @param sheet
   */
  Service.prototype.parseAudio = function (sheet) {

    const data = xlsx.utils.sheet_to_json(sheet).filter(item =>
      item.Id_audio !== undefined
      && item.file !== undefined
      && item.duration_audio !== undefined
    )

    if (data.length === 0) return

    return Promise.all(data.map(async item => {

      let duration = parseInt(item.duration_audio);
      if (isNaN(duration)) duration = 0

      const content = {
        name: item.Id_audio.trim(),
        file: item.file.trim(),
        duration,
      }

      let entity = await Audio.findOne({name: content.name})

      try {

        if (!entity) {
          audioService.create(content)
        } else {
          audioService.update(entity, content)
        }

      } catch (e) {

        return {
          message: `Аудио ${content.name} содержит ошибки`
        }

      }
    }))
  }

  /**
   * Header: Id_audio, file, duration_audio, isfailm, isfaild, isopenedfail, isclosedfail, description_audio
   *
   * @param sheet
   * @param locale
   */
  Service.prototype.parseAudioFail = function (sheet, locale) {

    const data = xlsx.utils.sheet_to_json(sheet).filter(item =>
      item.Id_audio !== undefined
      && item.file !== undefined
      && item.duration_audio !== undefined
      && item.isfailm !== undefined
      && item.isfaild !== undefined
      && item.isopenedfail !== undefined
      && item.isclosedfail !== undefined
      && item.description_audio !== undefined
    )

    if (data.length === 0) return

    return Promise.all(data.map(async item => {

      let duration = parseInt(item.duration_audio);
      if (isNaN(duration)) duration = 0

      const content = {
        name: item.Id_audio.trim(),
        file: item.file.trim(),
        duration,
        audio: null,
        isFailOpenedOnStart: item.isopenedfail.toLowerCase() === 'true',
        isFailOpenedOnComplete: item.isclosedfail.toLowerCase() === 'true',
        isFailDaughter: item.isfaild.toLowerCase() === 'true',
        isFailMunhauzen: item.isfailm.toLowerCase() === 'true',
        locale,
        description: item.description_audio,
      }

      content.audio = content.name.split('_fail')[0]

      let entity = await AudioFail.findOne({name: content.name})

      try {

        if (!entity) {
          audioFailService.create(content)
        } else {
          audioFailService.update(entity, content)
        }

      } catch (e) {

        return {
          message: `Аудио-фейл ${content.name} содержит ошибки`
        }

      }
    }))
  }

  Service.prototype.parseAudioFailEn = function (sheet) {
    return this.parseAudioFail(sheet, 'en')
  }

  Service.prototype.parseAudioFailRu = function (sheet) {
    return this.parseAudioFail(sheet, 'ru')
  }

  Service.prototype.parseAudioFailUa = function (sheet) {
    return this.parseAudioFail(sheet, 'ua')
  }

  return new Service();
})()

module.exports = ImportService;

