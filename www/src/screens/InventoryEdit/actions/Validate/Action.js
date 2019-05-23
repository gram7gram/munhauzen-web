import i18n from '../../../../i18n'

export default model => {
  const validator = {
    count: 0,
    messages: [],
    errors: {}
  }

  if (!model.name) {
    ++validator.count
    validator.errors.name = i18n.t('validation_required')
  }

  if (model.relatedScenario.length === 0 && model.relatedInventory.length === 0) {
    ++validator.count
    validator.errors.relatedScenario = i18n.t('validation_required')
    ++validator.count
    validator.errors.relatedInventory = i18n.t('validation_required')
  }

  const trans = Object.values(model.statueTranslations)

  if (model.isStatue && trans.length === 0) {
    ++validator.count
    validator.errors.statueTranslations = i18n.t('validation_required')
  }

  trans.forEach(trans => {
    if (!trans.description) {
      ++validator.count
      validator.errors['description_' + trans.locale] = i18n.t('validation_required')
    }
  })

  return validator
}