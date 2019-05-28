const xlsx = require('xlsx');

const Chapter = require('../../database/model/Chapter').Chapter;
const Inventory = require('../../database/model/Inventory').Inventory;
const Audio = require('../../database/model/Audio').Audio;
const AudioFail = require('../../database/model/AudioFail').AudioFail;
const Image = require('../../database/model/Image').Image;
const Scenario = require('../../database/model/Scenario').Scenario;

const logger = require('../../logger');

const aggregate = async function (data, callback) {
  return await Promise.all(data.map(callback))
}

const ImportService = (function () {

  function Service() {
  }

  Service.prototype.parse = async function (file) {

    let workbook
    try {
      workbook = xlsx.read(file.data.buffer, {type: 'buffer'})
    } catch (e) {

      logger.error(e)

      throw {
        message: 'Невозможно прочитать содержимое файла',
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
      'scenario_1': this.parseScenario.bind(this),
    }

    await Scenario.deleteMany()
    await Inventory.deleteMany()
    await AudioFail.deleteMany()
    await Audio.deleteMany()
    await Image.deleteMany()
    await Chapter.deleteMany()

    let result = await aggregate(Object.keys(handlers), async name => {

      const handler = handlers[name]

      if (workbook.Sheets[name] !== undefined) {

        const sheetResult = await handler(workbook.Sheets[name])

        const errors = sheetResult && sheetResult.result ? sheetResult.result.filter(e => e && e.message) : []
        const warnings = sheetResult && sheetResult.warnings ? sheetResult.warnings : []

        return {
          sheet: name,
          warnings,
          errors
        }
      }

    })

    result = result.filter(e => e && e.sheet)

    return {
      hasErrors: !!result.find(item => item.errors.lenngth > 0),
      result
    }
  }

  /**
   * Header: id_option, id_chapter, description_option_eng, id_audio, id_picture, type_pictures,
   * duration_picture, Interaction, action, id_decisions, inventory_required, inventory_abscent
   *
   * @param sheet
   */
  Service.prototype.parseScenario = async function (sheet) {

    const json = xlsx.utils.sheet_to_json(sheet)

    const data = json.filter(item =>
      item.id_option !== undefined
      || item.id_picture !== undefined
      || item.id_audio !== undefined
      || item.id_decisions !== undefined
    )

    if (data.length !== json.length) {
      logger.error('Some rows are invalid in parseScenario')
    }

    if (data.length === 0) return

    const warnings = [], scenarios = {}

    let currentScenario, currentAction

    const parseDecision = item => {

      if (item.action) {
        currentAction = item.action.trim().toUpperCase()
      }

      const decision = {
        scenario: item.id_decisions.trim(),
        action: currentAction
      }

      if (decision.scenario.indexOf('a') !== 0) {

        warnings.push('Развитие сценария ' + decision.scenario + ' не начинается на "a"')

        decision.scenario = 'a' + decision.scenario.substr(1)
      }

      if (!decision.action) {

        warnings.push('Развитие сценария ' + decision.scenario + ' без action')

        decision.action = 'CLICK'
      }

      return decision
    }

    const parseAudio = item => {
      const audio = {
        audio: item.id_audio.trim(),
        duration: 0
      }

      if (audio.audio === 'Z') {
        audio.audio = 's' + currentScenario.name.substr(1)
      }

      if (audio.audio !== 'Last') {
        if (audio.audio.indexOf('s') !== 0) {

          warnings.push('Аудио ' + audio.audio + ' не начинается на "s"')

          audio.audio = 's' + audio.audio.substr(1)
        }
      }

      return audio
    }

    const parseImage = item => {
      const image = {
        image: item.id_picture.trim(),
        duration: 0
      }

      if (image.image === 'Z') {
        image.image = 'p' + currentScenario.name.substr(1)
      }

      if (item.duration_picture) {
        let value = parseInt(item.duration_picture)
        if (value > 0) {
          image.duration = value
        }
      }

      if (item.type_picture) {
        const type = item.type_picture.trim()
        if (type !== 'Empty') {
          image.type = type.toUpperCase()
        }
      }

      if (image.image !== 'Last') {
        if (image.image.indexOf('p') !== 0) {

          warnings.push('Картинка ' + image.image + '  не начинается на "p"')

          image.image = 'p' + image.image.substr(1)
        }
      }

      return image
    }

    const parseScenario = item => {

      const translations = []

      if (item.description_option_eng) {
        translations.push({
          locale: 'en',
          text: item.description_option_eng
        })
      }

      if (item.description_option_ru) {
        translations.push({
          locale: 'ru',
          text: item.description_option_ru
        })
      }

      if (item.description_option_ua) {
        translations.push({
          locale: 'ua',
          text: item.description_option_ua
        })
      }

      const scenario = {
        name: item.id_option.trim(),
        chapter: item.id_chapter.trim(),
        decisions: [],
        audio: [],
        images: [],
        translations
      }

      if (item.interaction) {
        scenario.interaction = item.interaction.trim().toUpperCase()
      }

      if (scenario.name.indexOf('a') !== 0) {
        warnings.push('Сценарий ' + scenario.name + ' не начинается на "a"')

        scenario.name = 'a' + scenario.name.substr(1)
      }

      if (scenario.name.indexOf(scenario.chapter) !== 0) {
        warnings.push('Сценарий ' + scenario.name + ' не совпадает с главой ' + scenario.chapter)
      }

      return scenario
    }

    const saveScenario = async content => {

      try {

        await Scenario.findOneAndUpdate({name: content.name}, content, {
          upsert: true, new: true, runValidators: true
        })

      } catch (e) {

        logger.error(e)

        if (e && e.code === 11000) {
          return {
            message: `Сценарий ${content.name} уже существует`
          }
        }

        return {
          message: `Сценарий ${content.name} содержит ошибки`
        }
      }
    }

    data.forEach(item => {

      if (item.id_option) {

        if (currentScenario) {
          scenarios[currentScenario.name] = {...currentScenario}
        }

        currentScenario = parseScenario(item)
      }

      if (item.id_picture && item.id_picture !== 'Empty' && item.id_picture !== 'XXX') {
        currentScenario.images.push(parseImage(item))
      }

      if (item.id_audio && item.id_audio !== 'Empty' && item.id_audio !== 'XXX') {
        currentScenario.audio.push(parseAudio(item))
      }

      if (item.id_decisions && item.id_decisions !== 'Empty') {
        currentScenario.decisions.push(parseDecision(item))
      }

    })

    const result = await aggregate(Object.values(scenarios), async scenario => {
      await saveScenario(scenario)
    })

    return {
      result,
      warnings
    }
  }

  /**
   * Header: chapter_id, icon_chapter, description_chapter_eng, description_chapter_ru, description_chapter_ua
   *
   * @param sheet
   */
  Service.prototype.parseChapters = async function (sheet) {

    const json = xlsx.utils.sheet_to_json(sheet)

    const data = json.filter(item =>
      item.chapter_id !== undefined
      && (item.description_chapter_eng !== undefined || item.description_chapter_ru !== undefined || item.description_chapter_ua !== undefined)
    )

    if (data.length !== json.length) {
      logger.error('Some rows are invalid in parseChapters')
    }

    if (data.length === 0) return

    const result = await aggregate(data, async item => {

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

      const content = {
        name: item.chapter_id.trim(),
        icon: item.icon_chapter ? item.icon_chapter.trim() : null,
        translations
      }

      try {

        await Chapter.findOneAndUpdate({name: content.name}, content, {
          upsert: true, new: true, runValidators: true
        })

      } catch (e) {

        logger.error(e)

        if (e && e.code === 11000) {
          return {
            message: `Глава ${content.name} уже существует`
          }
        }

        return {
          message: `Глава ${content.name} содержит ошибки`
        }

      }
    })

    return {
      result,
      warnings: []
    }
  }

  /**
   * Header: Name, Related_option
   *
   * @param sheet
   */
  Service.prototype.parseGameInventory = async function (sheet) {
    const json = xlsx.utils.sheet_to_json(sheet)

    const data = json.filter(item =>
      item.Name !== undefined
      && item.Related_option !== undefined
    )

    if (data.length !== json.length) {
      logger.error('Some rows are invalid in parseGameInventory')
    }

    if (data.length === 0) return

    const result = await aggregate(data, async item => {

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

      try {

        await Inventory.findOneAndUpdate({name: content.name, isMenu: true}, content, {
          upsert: true, new: true, runValidators: true
        })

      } catch (e) {

        logger.error(e)

        if (e && e.code === 11000) {
          return {
            message: `Инвентарь ${content.name} уже существует`
          }
        }

        return {
          message: `Инвентарь ${content.name} содержит ошибки`
        }

      }
    })

    return {
      result,
      warnings: []
    }
  }

  /**
   * Header: inventory_global_required, Related_option
   *
   * @param sheet
   */
  Service.prototype.parseMenuInventory = async function (sheet) {

    const json = xlsx.utils.sheet_to_json(sheet)

    const data = json.filter(item =>
      item.inventory_global_required !== undefined
      && item.Related_option !== undefined
    )

    if (data.length !== json.length) {
      logger.error('Some rows are invalid in parseMenuInventory')
    }

    if (data.length === 0) return

    const result = await aggregate(data, async item => {

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

      try {

        await Inventory.findOneAndUpdate({name: content.name}, content, {
          upsert: true, new: true, runValidators: true
        })

      } catch (e) {

        logger.error(e)

        if (e && e.code === 11000) {
          return {
            message: `Инвентарь ${content.name} уже существует`
          }
        }

        return {
          message: `Инвентарь ${content.name} содержит ошибки`
        }

      }
    })

    return {
      result,
      warnings: []
    }
  }

  /**
   * Header: Name, Related_option, Related_inventory, Description_Eng, Description_Ua, Description_Ru
   *
   * @param sheet
   */
  Service.prototype.parseStatueInventory = async function (sheet) {

    const json = xlsx.utils.sheet_to_json(sheet)

    const data = json.filter(item =>
      item.Name !== undefined
      && (item.Description_Eng !== undefined || item.Description_Ua !== undefined || item.Description_Ru !== undefined)
    )

    if (data.length !== json.length) {
      logger.error('Some rows are invalid in parseStatueInventory')
    }

    if (data.length === 0) return

    const result = await aggregate(data, async item => {

      let relatedScenario = [], relatedInventory = [], statueTranslations = []

      if (item.Related_options) {
        if (item.Related_options.indexOf(' or ') !== 1) {

          relatedScenario = item.Related_options.split(' or ')
            .map(item => item.trim())

            .filter(item => !!item && item !== 'Empty')
        } else {

          relatedScenario = item.Related_options.split(',')
            .map(item => item.trim())
            .filter(item => !!item && item !== 'Empty')

        }
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

      try {

        await Inventory.findOneAndUpdate({name: content.name}, content, {
          upsert: true, new: true, runValidators: true
        })

      } catch (e) {

        logger.error(e)

        if (e && e.code === 11000) {
          return {
            message: `Инвентарь ${content.name} уже существует`
          }
        }

        return {
          message: `Инвентарь ${content.name} содержит ошибки`
        }

      }
    })

    return {
      result,
      warnings: []
    }
  }

  /**
   * Header: Id_picture, file, type, description_picture_ua, description_picture_ru, description_picture_eng,
   * description_statue_ua, description_statue_ru, description_statue_eng, isanimation, isforbidden
   *
   * @param sheet
   */
  Service.prototype.parseImage = async function (sheet) {

    const json = xlsx.utils.sheet_to_json(sheet)

    const data = json.filter(item =>
      item.Id_picture !== undefined
      && item.file !== undefined
      && item.type !== undefined
      && item.isanimation !== undefined
      && item.isforbidden !== undefined
      && (item.description_picture_ua !== undefined || item.description_picture_ru !== undefined || item.description_picture_eng !== undefined)
    )

    if (data.length !== json.length) {
      logger.error('Some rows are invalid in parseImage')
    }

    if (data.length === 0) return

    const result = await aggregate(data, async item => {

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

      try {

        await Image.findOneAndUpdate({name: content.name}, content, {
          upsert: true, new: true, runValidators: true
        })

      } catch (e) {

        logger.error(e)

        if (e && e.code === 11000) {
          return {
            message: `Картинка ${content.name} уже существует`
          }
        }

        return {
          message: `Картинка ${content.name} содержит ошибки`
        }

      }
    })

    return {
      result,
      warnings: []
    }
  }

  /**
   * Header: Id_audio, file, duration_audio
   *
   * @param sheet
   */
  Service.prototype.parseAudio = async function (sheet) {

    const json = xlsx.utils.sheet_to_json(sheet)

    const data = json.filter(item =>
      item.Id_audio !== undefined
      && item.file !== undefined
      && item.duration_audio !== undefined
    )

    if (data.length !== json.length) {
      logger.error('Some rows are invalid in parseAudio')
    }

    if (data.length === 0) return

    const result = await aggregate(data, async item => {

      let duration = parseInt(item.duration_audio);
      if (isNaN(duration)) duration = 0

      const content = {
        name: item.Id_audio.trim(),
        file: item.file.trim(),
        duration,
      }

      try {

        await Audio.findOneAndUpdate({name: content.name}, content, {
          upsert: true, new: true, runValidators: true
        })

      } catch (e) {

        logger.error(e)

        if (e && e.code === 11000) {
          return {
            message: `Аудио ${content.name} уже существует`
          }
        }

        return {
          message: `Аудио ${content.name} содержит ошибки`
        }

      }
    })

    return {
      result,
      warnings: []
    }
  }

  /**
   * Header: Id_audio, file, duration_audio, isfailm, isfaild, isopenedfail, isclosedfail, description_audio
   *
   * @param sheet
   * @param locale
   */
  Service.prototype.parseAudioFail = async function (sheet, locale) {

    const json = xlsx.utils.sheet_to_json(sheet)

    const data = json.filter(item =>
      item.Id_audio !== undefined
      && item.file !== undefined
      && item.duration_audio !== undefined
      && item.isfailm !== undefined
      && item.isfaild !== undefined
      && item.isopenedfail !== undefined
      && item.isclosedfail !== undefined
      && item.description_audio !== undefined
    )

    if (data.length !== json.length) {
      logger.error('Some rows are invalid in parseAudioFail')
    }

    if (data.length === 0) return

    const result = await aggregate(data, async item => {

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

      try {

        await AudioFail.findOneAndUpdate({name: content.name}, content, {
          upsert: true, new: true, runValidators: true
        })

      } catch (e) {

        logger.error(e)

        if (e && e.code === 11000) {
          return {
            message: `Аудио-фейл ${content.name} уже существует`
          }
        }

        return {
          message: `Аудио-фейл ${content.name} содержит ошибки`
        }

      }
    })

    return {
      result,
      warnings: []
    }
  }

  Service.prototype.parseAudioFailEn = async function (sheet) {
    return await this.parseAudioFail(sheet, 'en')
  }

  Service.prototype.parseAudioFailRu = async function (sheet) {
    return await this.parseAudioFail(sheet, 'ru')
  }

  Service.prototype.parseAudioFailUa = async function (sheet) {
    return await this.parseAudioFail(sheet, 'ua')
  }

  return new Service();
})()

module.exports = ImportService;
