const {boot, expect, tearDown} = require('../../WebTestCase')
const scenarioService = require('../../../src/server/services/ScenarioService')
const {cid} = require('../../utils')

describe('ScenarioRESTController', () => {

  const dummy = {
    "name": cid(10),
    "chapter": cid(10),
    "translations": [
      {"locale": 'ua', "text": cid(10)},
      {"locale": 'ru', "text": cid(10)},
    ],
    "inventoryAdd": cid(10).toUpperCase(),
    "images": [
      {
        "image": cid(10),
        "duration": 2500
      }
    ],
    "audio": [
      {
        "audio": cid(10),
        "duration": 2500
      },
      {
        "audio": cid(10),
        "duration": 2500
      }
    ],
    "action": "CLICK",
    "decisions": [
      {
        "scenario": cid(10),
        "inventoryRequired": [
          cid(), cid()
        ]
      },
      {
        "scenario": cid(10),
        "inventoryRequired": [
          cid()
        ]
      },
      {
        "scenario": cid(10),
        "inventoryRequired": [
          cid()
        ],
        "inventoryAbsent": [
          cid()
        ]
      }
    ]
  }

  let app

  beforeEach(() => {
    app = boot()
  })

  afterEach(tearDown)

  it('GET /api/v1/scenario is successful', (done) => {

    app.get('/api/v1/scenario')
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.items).not.to.equal(undefined)
        expect(res.body.count).not.to.equal(undefined)

        done();
      });
  })

  it('POST /api/v1/scenario is successful', (done) => {

    app.post('/api/v1/scenario')
      .type('application/json')
      .send(JSON.stringify(dummy))
      .end((err, res) => {

        expect(res.statusCode).to.equal(201)
        expect(res.body._id).not.to.equal(undefined)

        done();
      });
  })

  it('GET /api/v1/scenario/:id is successful', (done) => {

    const entity = scenarioService.create(dummy)

    app.get(`/api/v1/scenario/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)

        done();
      });
  })

  it('PUT /api/v1/scenario/:id is successful', (done) => {

    const entity = scenarioService.create(dummy)

    const changes = {
      inventoryAdd: cid(12).toUpperCase()
    }

    app.put(`/api/v1/scenario/${entity._id}`)
      .type('application/json')
      .send(JSON.stringify(changes))
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.inventoryAdd).to.equal(changes.inventoryAdd)

        done();
      });
  })

  it('DELETE /api/v1/scenario/:id is successful', (done) => {

    const entity = scenarioService.create(dummy)

    app.del(`/api/v1/scenario/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(204)

        done();
      });
  })
})