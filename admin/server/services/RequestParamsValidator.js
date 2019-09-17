
const checkLocale = (req, res, next) => {

  if (['en', 'ru', 'ua'].indexOf(req.params.locale) === -1) {
    res.redirect('/en')
    return
  }

  next()
}

module.exports = {
  checkLocale,
}