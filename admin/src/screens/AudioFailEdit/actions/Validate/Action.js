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

  if (!model.file) {
    ++validator.count
    validator.errors.file = i18n.t('validation.required')
  }

  if (!model.audio) {
    ++validator.count
    validator.errors.audio = i18n.t('validation.required')
  }

  if (!model.description) {
    ++validator.count
    validator.errors.description = i18n.t('validation.required')
  }

  return validator
}