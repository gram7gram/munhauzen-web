
const checkId = (req, res, next) => {

  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    res.status(400).json({
      message: 'Invalid `id` in request',
    })
    return
  }

  next()
}

const checkLocale = (req, res, next) => {

  if (['en', 'ru', 'ua'].indexOf(req.params.locale) === -1) {
    res.status(400).json({
      message: 'Invalid `locale` in request',
    })
    return
  }

  next()
}

module.exports = {
  checkId,
  checkLocale,
}