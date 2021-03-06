import i18n from '../../../../i18n'

export default model => {
  const validator = {
    count: 0,
    messages: [],
    errors: {}
  }

  if (!model.name) {
    ++validator.count
    validator.errors.name = i18n.t('validation.required')
  }

  if (!model.icon) {
    ++validator.count
    validator.errors.icon = i18n.t('validation.required')
  }

  if (!model.chapterAudio) {
    ++validator.count
    validator.errors.chapterAudio = i18n.t('validation.required')
  }

  if (model.number < 0) {
    ++validator.count
    validator.errors.number = i18n.t('validation.required')
  }

  if (!model.description) {
    ++validator.count
    validator.errors['description'] = i18n.t('validation.required')
  }

  return validator
}