const chai = require('chai')
const chaiHttp = require('chai-http')

const db = require('../src/database/mongo')
const server = require('../src')

chai.use(chaiHttp);

module.exports = {
  boot: () => {

    // db.connect()

    return chai.request(server).keepOpen()
  },
  server,
  db,
  expect: chai.expect
}