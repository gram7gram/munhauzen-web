const path = require('path')

require('dotenv').config({path: path.resolve(__dirname + `/../.env`)});

const chai = require('chai')
const chaiHttp = require('chai-http')

const db = require('../database/mongo')
const server = require('../server')

chai.use(chaiHttp);

db.connect()

module.exports = {
  tearDown: () => {},
  boot: () => chai.request(server),
  server,
  db,
  expect: chai.expect
}