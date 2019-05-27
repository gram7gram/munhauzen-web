const xlsx = require('xlsx');
const Chapter = require('../../database/model/Chapter').Chapter;
const chapterService = require('./ChapterService');

const ImportService = (function () {

  function Service() {
  }

  Service.prototype.parse = async function (file) {

    let workbook, errors = {}, hasErrors = false
    try {
      workbook = xlsx.read(file.data.buffer, {type: 'buffer'})
    } catch (e) {
      throw {
        message: 'Невозможно прочитать содержимое файла',
        e
      }
    }

    if (workbook.Sheets['chapters'] !== undefined) {

      const chapterResult = await this.parseChapters(workbook.Sheets['chapters'])

      const chapterErrors = chapterResult.filter(e => e && e.message)

      if (chapterErrors.length > 0) {

        hasErrors = true
        errors['chapters'] = chapterErrors

      }
    }

    return {
      sheets: workbook.SheetNames,
      hasErrors,
      errors
    }
  }

  /**
   * Header: chapter_id, icon_chapter, description_chapter_eng, description_chapter_ru, description_chapter_ua
   *
   * @param sheet
   */
  Service.prototype.parseChapters = function (sheet) {

    const data = xlsx.utils.sheet_to_json(sheet).filter(item =>
      item.chapter_id !== undefined
      && (item.description_chapter_eng !== undefined || item.description_chapter_ru !== undefined || item.description_chapter_ua !== undefined)
    )

    if (data.length === 0) return

    return Promise.all(data.map(async item => {

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

  return new Service();
})()

module.exports = ImportService;

