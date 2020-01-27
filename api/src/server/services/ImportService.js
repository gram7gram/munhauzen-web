const xlsx = require('xlsx');

const Chapter = require('../../database/model/Chapter').Chapter;
const Inventory = require('../../database/model/Inventory').Inventory;
const Audio = require('../../database/model/Audio').Audio;
const AudioFail = require('../../database/model/AudioFail').AudioFail;
const Image = require('../../database/model/Image').Image;
const Scenario = require('../../database/model/Scenario').Scenario;

const imageService = require('../services/ImageService')
const scenarioService = require('../services/ScenarioService')

const hasCyrillic = name => /[АаБбВвГгДдЕеЭэЖжЗзИиЙйЫыКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчЩщШшЮюЯяЬьЪъЁё]/.test(name.toLowerCase())
  || /[АаБбВвГгДдЕеЄєЖжЗзИиЙйІіЇїКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчЩщШшЮюЯяЬь]/.test(name.toLowerCase())

const aggregate = async function (data, callback) {
  return await Promise.all(data.map(callback))
}

const parse = async function (file, locale) {

  let workbook
  try {
    workbook = xlsx.read(file.data.buffer, {type: 'buffer'})
  } catch (e) {

    throw {
      e,
      message: 'Невозможно прочитать содержимое файла',
    }
  }

  const handlers = {
    'chapters': parseChapters,
    'pictures': parseImage,
    'inventory (items for game)': parseGameInventory,
    'global_inventory (menu)': parseMenuInventory,
    'statue_inventory (statue, arch)': parseStatueInventory,
  }

  switch (locale) {
    case 'en':
      handlers['audio_scenario_eng'] = parseAudio
      handlers['fails_Eng'] = parseAudioFail
      break;
    case 'ru':
      handlers['audio_scenario_ru'] = parseAudio
      handlers['fails_Ru'] = parseAudioFail
      break;
    case 'ua':
      handlers['audio_scenario_ukr'] = parseAudio
      handlers['fails_Ukr'] = parseAudioFail
      break;
  }

  await Scenario.deleteMany({locale})
  await Inventory.deleteMany({locale})
  await AudioFail.deleteMany({locale})
  await Audio.deleteMany({locale})
  await Image.deleteMany({locale})
  await Chapter.deleteMany({locale})

  let result = await aggregate(Object.keys(handlers), async name => {

    const handler = handlers[name]

    if (workbook.Sheets[name] !== undefined) {

      const sheetResult = await handler(locale, workbook.Sheets[name])

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

  const scenarioHandlers = {
    'scenario_1': parseScenario('scenario_1'),
    'scenario_2': parseScenario('scenario_2'),
    'scenario_3': parseScenario('scenario_3'),
  }

  const scenarioResult = await aggregate(Object.keys(scenarioHandlers), async name => {

    const handler = scenarioHandlers[name]

    if (workbook.Sheets[name] !== undefined) {

      const sheetResult = await handler(locale, workbook.Sheets[name])

      const errors = sheetResult && sheetResult.result
        ? sheetResult.result.filter(e => e && e.message)
        : []

      const warnings = sheetResult && sheetResult.warnings
        ? sheetResult.warnings
        : []

      return {
        sheet: name,
        warnings,
        errors,
      }
    }

  })

  result = result.concat(scenarioResult.filter(e => e && e.sheet))

  await imageService.restoreDefaults(locale)

  await scenarioService.restoreDefaults(locale)

  return {
    hasErrors: !!result.find(item => item.errors.length > 0),
    result
  }
}

/**
 * Header: id_option, id_chapter, description_option_eng, description_option_ru, id_audio, id_picture, type_pictures,
 * duration_picture_eng, duration_picture_ru, Interaction, action, id_decisions, decision_order,
 * inventory_required, inventory_abscent
 */
const parseScenario = source => async function (locale, sheet) {

  const json = xlsx.utils.sheet_to_json(sheet)

  const data = json.filter(item =>
    item.id_option !== undefined
    || item.id_picture !== undefined
    || item.id_audio !== undefined
    || item.id_decisions !== undefined
  )

  if (data.length === 0) return

  const audios = await Audio.find({locale}).lean()
  const images = await Image.find({locale}).lean()

  const warnings = [], scenarios = {}

  let currentScenario

  const createDecision = item => {

    const decision = {
      order: 0,
      scenario: item.id_decisions ? item.id_decisions.trim() : null,
      inventoryRequired: [],
      inventoryAbsent: [],
    }

    if (decision.scenario && hasCyrillic(decision.scenario)) {
      warnings.push(`У сценария ${decision.scenario} кирилица в названии`)
    }

    if (item.decision_order !== undefined) {
      let value = parseInt(item.decision_order)
      if (isNaN(value)) value = 0

      decision.order = value
    }

    if (item.inventory_required !== undefined) {
      decision.inventoryRequired = item.inventory_required.trim().toUpperCase()
        .split(',')
        .map(item => item.trim())
        .filter(item => !!item)
    }

    if (item.inventory_abscent !== undefined) {
      decision.inventoryAbsent = item.inventory_abscent.trim().toUpperCase()
        .split(',')
        .map(item => item.trim())
        .filter(item => !!item)
    }

    if (decision.scenario.indexOf('a') !== 0) {

      warnings.push('Развитие сценария ' + decision.scenario + ' не начинается на "a"')

      decision.scenario = 'a' + decision.scenario.substr(1)
    }

    return decision
  }

  const createAudio = item => {
    const audio = {
      audio: item.id_audio ? (item.id_audio + "").trim() : null,
      duration: 0
    }

    if (hasCyrillic(audio.audio)) {
      warnings.push(`У аудио ${audio.audio} кирилица в названии`)
    }

    if (audio.audio === 'Z') {
      audio.audio = 's' + currentScenario.name.substr(1)
    }

    if (audio.audio !== 'Last') {
      if (audio.audio.indexOf('s') !== 0) {

        warnings.push('Аудио ' + audio.audio + ' не начинается на "s"')

        audio.audio = 's' + audio.audio.substr(1)
      }

      const match = audios.find(item => item.name === audio.audio)
      if (!match) {
        warnings.push('Аудио ' + audio.audio + ' не существует')
      } else if (!match.duration) {
        warnings.push('Длительно аудио ' + audio.audio + ' не указана')
      } else {
        audio.duration = match.duration
      }
    }

    return audio
  }

  const createImage = item => {
    const image = {
      image: item.id_picture ? item.id_picture.trim() : null,
      duration: 0
    }

    if (hasCyrillic(image.image)) {
      warnings.push(`У картинки ${image.image} кирилица в названии`)
    }

    if (image.image === 'Z') {
      image.image = 'p' + currentScenario.name.substr(1)
    }

    let durationPicture = 0

    switch (locale) {
      case 'en':
        durationPicture = item.duration_picture_eng
        break;
      case 'ru':
        durationPicture = item.duration_picture_ru
        break;
    }

    if (durationPicture) {
      if (durationPicture === 'R') {
        image.isR = true
      } else {
        let value = parseInt(durationPicture)
        if (value > 0) {
          image.duration = value
        }
      }
    }

    if (item.type_picture) {
      const type = item.type_picture.trim()
      if (type !== 'Empty') {
        image.type = type.toUpperCase()
      }
    }

    if (item.transition_picture) {
      const type = item.transition_picture.trim()
      if (type !== 'Empty') {
        image.transition = type.toUpperCase()
      }
    }

    if (image.image !== 'Last') {
      if (image.image.indexOf('inter') !== 0) { //ignore inter_
        if (image.image.indexOf('p') !== 0) {

          warnings.push('Картинка ' + image.image + '  не начинается на "p"')

          image.image = 'p' + image.image.substr(1)
        }

        const match = images.find(item => item.name === image.image)
        if (!match) {
          warnings.push('Картинка ' + image.image + ' не существует')
        }
      }
    }

    return image
  }

  const createScenario = item => {

    let text = '';

    switch (locale) {
      case 'en':
        text = item.description_option_eng || ''
        break;
      case 'ru':
        text = item.description_option_ru || ''
        break;
      case 'ua':
        text = item.description_option_ua || ''
        break;
    }

    const scenario = {
      name: item.id_option ? item.id_option.trim() : null,
      chapter: item.id_chapter ? item.id_chapter.trim() : null,
      expansion: item.Purchase ? item.Purchase.trim() : 'Part_demo',
      action: item.action ? item.action.trim().toUpperCase() : null,
      decisions: [],
      audio: [],
      images: [],
      locale,
      text,
      source
    }

    if (scenario.name && hasCyrillic(scenario.name)) {
      warnings.push(`У сценария ${scenario.name} кирилица в названии`)
    }

    if (item.Interaction) {
      scenario.interaction = item.Interaction.trim().toUpperCase()
    }

    if (!scenario.interaction && scenario.action === 'CLICK' && !text) {
      warnings.push('Сценарию ' + scenario.name + ' не хватает перевода')
    }

    if (scenario.name.indexOf('a') !== 0) {
      warnings.push('Сценарий ' + scenario.name + ' не начинается на "a"')

      scenario.name = 'a' + scenario.name.substr(1)
    }

    return scenario
  }

  const saveScenario = async content => {

    try {

      await Scenario.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: true
      })

    } catch (e) {


      if (e && e.code === 11000) {
        return {
          e,
          message: `Сценарий ${content.name} уже существует`
        }
      }

      return {
        e,
        message: `Сценарий ${content.name} содержит ошибки`
      }
    }
  }

  data.forEach(item => {

    if (item.id_option) {

      if (currentScenario) {
        scenarios[currentScenario.name] = {...currentScenario}
      }

      currentScenario = createScenario(item)

      if (currentScenario.name === 'a1_intro_chapter') {
        currentScenario.isBegin = true
      }
    }

    if (currentScenario) {

      if (item.id_picture && item.id_picture !== 'Empty' && item.id_picture !== 'XXX') {
        currentScenario.images.push(createImage(item))
      }

      if (item.id_audio && item.id_audio !== 'Empty' && item.id_audio !== 'XXX') {
        currentScenario.audio.push(createAudio(item))
      }

      if (item.id_decisions && item.id_decisions !== 'Empty') {
        currentScenario.decisions.push(createDecision(item))
      }
    }

  })

  Object.values(scenarios).forEach(scenario => {

    if (scenario.audio && scenario.audio.length > 0) {
      const duration = scenario.audio.reduce((sum, audio) => sum + audio.duration, 0)

      if (duration > 0) {
        if (scenario.images && scenario.images.length > 0) {
          const rImage = scenario.images.find(item => item.isR)
          if (rImage) {
            const durationWithoutR = scenario.images.filter(item => !item.isR).reduce((sum, audio) => sum + audio.duration, 0)

            rImage.duration = duration - durationWithoutR

            if (rImage.duration < 0) {
              warnings.push(`Неправильно указана длительность "R" в сценарие ${scenario.name} и картинке ${rImage.image}`)
            }

            delete rImage.isR
          }
        }
      } else {
        warnings.push(`Не указана длительность аудио в сценарие ${scenario.name}`)
      }

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
const parseChapters = async function (locale, sheet) {

  const json = xlsx.utils.sheet_to_json(sheet)

  const data = json.filter(item =>
    item.chapter_id !== undefined
    && item.icon_chapter !== undefined
  )

  if (data.length === 0) return

  const warnings = []

  const result = await aggregate(data, async item => {

    let description = '';

    switch (locale) {
      case 'en':
        description = item.description_chapter_eng || ''
        break;
      case 'ru':
        description = item.description_chapter_ru || ''
        break;
      case 'ua':
        description = item.description_chapter_ua || ''
        break;
    }

    const content = {
      name: item.chapter_id.trim(),
      icon: "chapter/" + item.icon_chapter.trim(),
      locale,
      description
    }

    if (hasCyrillic(content.name)) {
      warnings.push(`У главы ${content.name} кирилица в названии`)
    }

    if (item.chapter_audio !== undefined) {
      content.chapterAudio = item.chapter_audio.trim()
    }

    if (item.chapter_number !== undefined) {
      const number = parseInt(item.chapter_number)
      if (isNaN(number) || number < 0) {
        warnings.push(`У главы ${content.name} неправильный номер`)
      } else {
        content.number = number
      }
    }

    try {

      await Chapter.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: true
      })

    } catch (e) {


      if (e && e.code === 11000) {
        return {
          e,
          message: `Глава ${content.name} уже существует`
        }
      }

      return {
        e,
        message: `Глава ${content.name} содержит ошибки`
      }

    }
  })

  return {
    result,
    warnings
  }
}

/**
 * Header: Name, Related_option
 *
 * @param sheet
 */
const parseGameInventory = async function (locale, sheet) {
  const json = xlsx.utils.sheet_to_json(sheet)

  const data = json.filter(item =>
    item.Name !== undefined
  )

  if (data.length === 0) return

  const result = await aggregate(data, async item => {

    const content = {
      name: item.Name.trim().toUpperCase(),
      locale,
    }

    if (hasCyrillic(content.name)) {
      warnings.push(`У инвентаря ${content.name} кирилица в названии`)
    }

    if (item.Related_option) {
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

      content.relatedScenario = relatedScenario
    }

    try {

      await Inventory.findOneAndUpdate({name: content.name, isMenu: true}, content, {
        upsert: true, new: true, runValidators: true
      })

    } catch (e) {


      if (e && e.code === 11000) {
        return {
          e,
          message: `Инвентарь ${content.name} уже существует`
        }
      }

      return {
        e,
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
const parseMenuInventory = async function (locale, sheet) {

  const json = xlsx.utils.sheet_to_json(sheet)

  const data = json.filter(item =>
    item.inventory_global_required !== undefined
  )

  if (data.length === 0) return

  const result = await aggregate(data, async item => {

    const content = {
      name: item.inventory_global_required.trim().toUpperCase(),
      locale,
      isMenu: true,
    }

    if (hasCyrillic(content.name)) {
      warnings.push(`У инвентаря ${content.name} кирилица в названии`)
    }

    if (item.Related_option) {
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

      content.relatedScenario = relatedScenario
    }

    try {

      await Inventory.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: true
      })

    } catch (e) {


      if (e && e.code === 11000) {
        return {
          e,
          message: `Инвентарь ${content.name} уже существует`
        }
      }

      return {
        e,
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
 * Header: Name, Related_option, Related_inventory, Description_Eng, Description_Ua, Description_Ru, statue_image
 *
 * @param sheet
 */
const parseStatueInventory = async function (locale, sheet) {

  const json = xlsx.utils.sheet_to_json(sheet)

  const data = json.filter(item =>
    item.Name !== undefined
    && item.statue_image !== undefined
  )

  if (data.length === 0) return

  const result = await aggregate(data, async item => {

    let relatedScenario = [], relatedInventory = []

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

    let description = ''

    switch (locale) {
      case 'en':
        description = item.Description_Eng || ''
        break;
      case 'ru':
        description = item.Description_Ru || ''
        break;
      case 'ua':
        description = item.Description_Ua || ''
        break;

    }

    const content = {
      name: item.Name.trim().toUpperCase(),
      statueImage: 'gallery/' + item.statue_image.trim(),
      isStatue: true,
      relatedScenario,
      relatedInventory,
      locale,
      description
    }

    if (hasCyrillic(content.name)) {
      warnings.push(`У инвентаря ${content.name} кирилица в названии`)
    }

    try {

      await Inventory.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: true
      })

    } catch (e) {


      if (e && e.code === 11000) {
        return {
          e,
          message: `Инвентарь ${content.name} уже существует`
        }
      }

      return {
        e,
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
 * related_statue, isanimation, isforbidden, iscolor, isbonus, isstatue, related_option
 *
 * @param sheet
 */
const parseImage = async function (locale, sheet) {

  const json = xlsx.utils.sheet_to_json(sheet)

  const data = json.filter(item =>
    item.Id_picture !== undefined
    && item.file !== undefined
  )

  if (data.length === 0) return

  const warnings = []

  const result = await aggregate(data, async (item, i) => {

    let description = '';

    switch (locale) {
      case 'en':
        description = item.description_picture_eng || ''
        break;
      case 'ru':
        description = item.description_picture_ru || ''
        break;
      case 'ua':
        description = item.description_picture_ua || ''
        break;
    }

    const content = {
      name: item.Id_picture.trim(),
      file: "images/" + item.file.trim(),
      order: i,
      locale,
      description
    }

    if (hasCyrillic(content.name)) {
      warnings.push(`У картинки ${content.name} кирилица в названии`)
    }

    if (item.iscolor) {
      if (item.iscolor.trim().toLowerCase() === 'true') {
        content.type = "color"
      }
    }

    if (item.isbonus) {
      if (item.isbonus.trim().toLowerCase() === 'true') {
        content.type = "bonus"
      }
    }

    if (item.isstatue) {
      if (item.isstatue.trim().toLowerCase() === 'true') {
        content.type = "statue"
      }
    }

    if (item.isanimation) {
      content.isAnimation = item.isanimation.trim().toLowerCase() === 'true'
    }

    if (item.related_statue) {
      content.relatedStatue = item.related_statue.trim().toUpperCase()
    }

    if (item.related_option) {
      content.relatedScenario = item.related_option.trim()
    }

    if (item.isforbidden) {
      content.isHiddenFromGallery = item.isforbidden.trim().toLowerCase() === 'true'
    }

    if (!content.isHiddenFromGallery && !content.description) {
      warnings.push('Картинке ' + content.name + ' не хватает перевода')
    }

    try {

      await Image.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: true
      })

    } catch (e) {


      if (e && e.code === 11000) {
        return {
          e,
          message: `Картинка ${content.name} уже существует`
        }
      }

      return {
        e,
        message: `Картинка ${content.name} содержит ошибки`
      }

    }
  })

  return {
    result,
    warnings
  }
}

/**
 * Header: Id_audio, file, duration_audio_eng, duration_audio_ru
 *
 * @param sheet
 */
const parseAudio = async function (locale, sheet) {

  const json = xlsx.utils.sheet_to_json(sheet)

  const data = json.filter(item =>
    item.Id_audio !== undefined
    && item.file !== undefined
    && (item.duration_audio_eng !== undefined || item.duration_audio_ru !== undefined || item.duration_audio_ukr !== undefined)
  )

  if (data.length === 0) return

  const result = await aggregate(data, async item => {

    let duration = 0

    switch (locale) {
      case 'en':
        duration = parseInt(item.duration_audio_eng);
        break;
      case 'ru':
        duration = parseInt(item.duration_audio_ru);
        break;
      case 'ua':
        duration = parseInt(item.duration_audio_ukr);
        break;
    }

    if (isNaN(duration)) duration = 0

    const content = {
      name: item.Id_audio ? item.Id_audio.trim() : null,
      file: item.file ? "audio/" + item.file.trim() : null,
      duration,
      locale
    }

    if (hasCyrillic(content.name)) {
      warnings.push(`У аудио ${content.name} кирилица в названии`)
    }

    try {

      await Audio.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: true
      })

    } catch (e) {


      if (e && e.code === 11000) {
        return {
          e,
          message: `Аудио ${content.name} уже существует`
        }
      }

      return {
        e,
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
const parseAudioFail = async function (locale, sheet) {

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

  if (data.length === 0) return

  const result = await aggregate(data, async (item, i) => {

    let duration = parseInt(item.duration_audio);
    if (isNaN(duration)) duration = 0

    const content = {
      name: item.Id_audio.trim(),
      file: "audio/" + item.file.trim(),
      duration,
      isFailOpenedOnStart: item.isopenedfail.trim().toLowerCase() === 'true',
      isFailOpenedOnComplete: item.isclosedfail.trim().toLowerCase() === 'true',
      isFailDaughter: item.isfaild.trim().toLowerCase() === 'true',
      isFailMunhauzen: item.isfailm.trim().toLowerCase() === 'true',
      locale,
      description: item.description_audio,
      order: i,
    }

    if (hasCyrillic(content.name)) {
      warnings.push(`У фейла ${content.name} кирилица в названии`)
    }

    content.audio = content.name.split('_fail')[0]

    try {

      await AudioFail.findOneAndUpdate({name: content.name}, content, {
        upsert: true, new: true, runValidators: true
      })

    } catch (e) {


      if (e && e.code === 11000) {
        return {
          e,
          message: `Аудио-фейл ${content.name} уже существует`
        }
      }

      return {
        e,
        message: `Аудио-фейл ${content.name} содержит ошибки`
      }

    }
  })

  return {
    result,
    warnings: []
  }
}

module.exports = {
  parse,
};
  

