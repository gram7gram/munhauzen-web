
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

const server = require('./server')

server.listen(80, () => {
  console.log('Server started')
})