
console.log(`Starting app in ${process.env.NODE_ENV} environment...`)

// process.on('unhandledRejection', (reason, p) => {
//   console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
// })

const server = require('./server/express')

server.listen(80, () => {
  console.log('Server started')
})