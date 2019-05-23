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

  return validator
}