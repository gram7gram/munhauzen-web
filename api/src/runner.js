const logger = require('./logger')
const parameters = require('../parameters')

logger.info(`Starting app in ${process.env.NODE_ENV} environment...`)

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