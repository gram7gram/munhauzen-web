const i18n = require('i18n-js');
const parameters = require('../parameters')

const translations = {
  ua: () => require("./translations/ua.json"),
  ru: () => require("./translations/ru.json"),
  en: () => require("./translations/en.json"),
}

const prepareTranslations = (locale) => {

  if (!translations[locale]) {
    locale = Object.keys(translations)[0]
  }

  i18n.fallbacks = true;
  i18n.translations = {
    [locale]: translations[locale](),
  };
  i18n.locale = locale;
  i18n.missingTranslation = (name) => name;
}

const detectLocale = (req, res, next) => {

  let locale = req.params.locale || parameters.defaultLocale
  if (parameters.supportedLocales.indexOf(locale) === -1) {
    locale = parameters.defaultLocale
  }

  console.log('locale', locale);

  req.locale = locale

  prepareTranslations(req.locale)

  next()
}

module.exports = {
  i18n,
  prepareTranslations,
  detectLocale,
}
