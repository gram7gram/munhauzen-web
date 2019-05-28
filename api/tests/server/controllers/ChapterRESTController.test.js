const {boot, expect, tearDown} = require('../../WebTestCase')
const chaptersService = require('../../../src/server/services/ChapterService')
const {cid} = require('../../utils')

describe('ChapterRESTController', () => {

  let app

  beforeEach(() => {
    app = boot()
  })

  afterEach(tearDown)

  it('GET /api/v1/chapters is successful', async done => {

    app.get('/api/v1/chapters')
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.items).not.to.equal(undefined)
        expect(res.body.count).not.to.equal(undefined)

        done();
      });
  })

  it('POST /api/v1/chapters is successful', async done => {

    const entity = {
      name: cid(10),
      icon: cid(20),
    }

    app.post('/api/v1/chapters')
      .type('application/json')
      .send(JSON.stringify(entity))
      .end((err, res) => {

        expect(res.statusCode).to.equal(201)
        expect(res.body._id).not.to.equal(undefined)
        expect(res.body.name).to.equal(entity.name)
        expect(res.body.icon).to.equal(entity.icon)

        done();
      });
  })

  it('GET /api/v1/chapters/:id is successful', async done => {

    const entity = await chaptersService.create({
      name: cid(10),
      icon: cid(10)
    })

    app.get(`/api/v1/chapters/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)

        done();
      });
  })

  it('PUT /api/v1/chapters/:id is successful', async done => {

    const entity = await chaptersService.create({
      name: cid(10),
      icon: cid(20),
    })

    const changes = {
      name: cid(12)
    }

    app.put(`/api/v1/chapters/${entity._id}`)
      .type('application/json')
      .send(JSON.stringify(changes))
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.name).to.equal(changes.name)

        done();
      });
  })

  it('DELETE /api/v1/chapters/:id is successful', async done => {

    const entity = await chaptersService.create({
      name: cid(10),
      icon: cid(20),
    })

    app.del(`/api/v1/chapters/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(204)

        done();
      });
  })
})