const logger = require('./logger')
const parameters = require('../parameters')

process.on('unhandledRejection', (reason, p) => {
  logger.error(
    "Unhandled Rejection at:\r\n"
    + "Promise:\r\n" + JSON.stringify(p)
    + "Reason:\r\n" + JSON.stringify(reason)
  )
})

const db = require('./database/mongo');

db.connect()

const server = require('./index');

server.listen(parameters.port, () => {
  logger.info('Server started')
})