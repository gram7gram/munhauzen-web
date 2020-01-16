const i18n = require('i18n-js');

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

module.exports = {
  i18n,
  prepareTranslations,
}
