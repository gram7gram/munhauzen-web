
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

require('dotenv').config({path: `.env`});

const db = require('./database/mongo');

db.connect()

const server = require('./server');

server.listen(process.env.PORT, () => {
  console.log('Server started')
});