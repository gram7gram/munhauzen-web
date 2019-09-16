const path = require('path')

require('dotenv').config({path: path.resolve(__dirname + `/../.env`)});

const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../server')

chai.use(chaiHttp);

module.exports = {
  tearDown: (done) => {
    done()
  },
  boot: () => {
    return chai.request(server)
  },
  server,
  expect: chai.expect
}