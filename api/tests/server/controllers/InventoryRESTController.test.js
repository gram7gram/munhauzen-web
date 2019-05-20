const {boot, expect, tearDown} = require('../../WebTestCase')
const inventoryService = require('../../../server/services/InventoryService')
const {cid} = require('../../utils')

describe('InventoryRESTController', () => {

  let app

  beforeEach(() => {
    app = boot()
  })

  afterEach(tearDown)

  it('GET /api/v1/inventory is successful', (done) => {

    app.get('/api/v1/inventory')
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.items).not.to.equal(undefined)
        expect(res.body.count).not.to.equal(undefined)

        done();
      });
  })

  it('POST /api/v1/inventory is successful', (done) => {

    const entity = {
      name: cid(10).toUpperCase(),
    }

    app.post('/api/v1/inventory')
      .type('application/json')
      .send(JSON.stringify(entity))
      .end((err, res) => {

        expect(res.statusCode).to.equal(201)
        expect(res.body._id).not.to.equal(undefined)
        expect(res.body.name).to.equal(entity.name)

        done();
      });
  })

  it('GET /api/v1/inventory/:id is successful', (done) => {

    const entity = inventoryService.create({
      name: cid(10).toUpperCase(),
    })


    app.get(`/api/v1/inventory/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)

        done();
      });
  })

  it('PUT /api/v1/inventory/:id is successful', (done) => {

    const entity = inventoryService.create({
      name: cid(10).toUpperCase(),
    })

    const changes = {
      name: cid(12).toUpperCase()
    }

    app.put(`/api/v1/inventory/${entity._id}`)
      .type('application/json')
      .send(JSON.stringify(changes))
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.name).to.equal(changes.name)

        done();
      });
  })

  it('DELETE /api/v1/inventory/:id is successful', (done) => {

    const entity = inventoryService.create({
      name: cid(10).toUpperCase(),
    })

    app.del(`/api/v1/inventory/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(204)

        done();
      });
  })
})