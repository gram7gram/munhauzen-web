import i18n from '../../../../i18n'
import objectValues from "../../../../utils/objectValues";

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

  Object.values(model.translations).forEach(trans => {
    if (!trans.description) {
      ++validator.count
      validator.errors['description_' + trans.locale] = i18n.t('validation.required')
    }
  })

  return validator
}