// const Sentry = require('@sentry/node')

const ErrorHandler = {

  detectMessage: e => {
    let message = e.message

    if (!message && e.name === 'MongoError') {
      message = e.errmsg
    }

    return message
  },

  detectStatusCode: e => {
    let code = 500

    if (e.code >= 400 && e.code < 510) {
      code = e.code
    }

    return code
  },

  handle: (res, e) => {

    console.error(JSON.stringify(e), JSON.stringify(e.stack));

    const code = ErrorHandler.detectStatusCode(e)
    const message = ErrorHandler.detectMessage(e)

    // if (code >= 500) {
    //   Sentry.captureException(e)
    // }

    res.status(code).json({
      message,
      e
    })
  }

}

module.exports = ErrorHandler