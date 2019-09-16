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

  if (model.isStatue && !model.description) {
    ++validator.count
    validator.errors['description'] = i18n.t('validation.required')
  }

  return validator
}