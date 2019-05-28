const path = require('path')
const logger = require('./logger')

process.on('unhandledRejection', (reason, p) => {
  logger.error(
    "Unhandled Rejection at:\r\n"
    + "Promise:\r\n" + JSON.stringify(p)
    + "Reason:\r\n" + JSON.stringify(reason)
  )
})

require('dotenv').config({
  path: path.resolve(__dirname, `../.env`)
})

const db = require('./database/mongo');

db.connect()

const server = require('./index');

server.listen(process.env.PORT, () => {
  logger.info('Server started')
})