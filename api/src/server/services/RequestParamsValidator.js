
const checkId = (req, res, next) => {

  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    res.status(400).json({
      message: 'Invalid `id` in request',
    })
    return
  }

  next()
}

module.exports = {
  checkId
}