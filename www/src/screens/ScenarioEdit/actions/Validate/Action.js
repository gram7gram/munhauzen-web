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

  if (!model.chapter) {
    ++validator.count
    validator.errors.chapter = i18n.t('validation.required')
  }

  if (!model.action) {
    ++validator.count
    validator.errors.action = i18n.t('validation.required')
  }

  const trans = Object.values(model.translations)
  if (trans.length === 0) {
    ++validator.count
    validator.errors.translations = i18n.t('validation.required')
  }

  trans.forEach(trans => {
    if (!trans.text) {
      ++validator.count
      validator.errors['text_' + trans.locale] = i18n.t('validation.required')
    }
  })

  const images = Object.values(model.images)

  images.forEach(item => {
    if (!item.image) {
      ++validator.count
      validator.errors['image_' + item.cid] = i18n.t('validation.required')
    }

    if (item.duration < 0) {
      ++validator.count
      validator.errors['duration_' + item.cid] = i18n.t('validation.required')
    }
  })

  const audio = Object.values(model.audio)

  audio.forEach(item => {
    if (!item.audio) {
      ++validator.count
      validator.errors['audio_' + item.cid] = i18n.t('validation.required')
    }

    if (item.duration < 0) {
      ++validator.count
      validator.errors['duration_' + item.cid] = i18n.t('validation.required')
    }
  })

  const decisions = Object.values(model.decisions)
  if (decisions.length === 0) {
    ++validator.count
    validator.errors.decisions = i18n.t('validation.required')
  }

  decisions.forEach(item => {
    if (!item.scenario) {
      ++validator.count
      validator.errors['scenario_' + item.cid] = i18n.t('validation.required')
    }
  })

  return validator
}