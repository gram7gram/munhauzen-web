const {boot, expect, tearDown} = require('../../WebTestCase')
const audioService = require('../../../src/server/services/AudioService')
const {cid} = require('../../utils')

describe('AudioRESTController', () => {

  let app

  beforeEach(() => {
    app = boot()
  })

  afterEach(tearDown)

  it('GET /api/v1/audio is successful', async done => {

    app.get('/api/v1/audio')
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.items).not.to.equal(undefined)
        expect(res.body.count).not.to.equal(undefined)

        done();
      });
  })

  it('POST /api/v1/audio is successful', async done => {

    const entity = {
      name: cid(10),
      file: cid(20),
      translations: [
        {
          locale: 'ru',
          description: cid(30),
        },
        {
          locale: 'ua',
          description: cid(30),
        }
      ]
    }

    app.post('/api/v1/audio')
      .type('application/json')
      .send(JSON.stringify(entity))
      .end((err, res) => {

        expect(res.statusCode).to.equal(201)
        expect(res.body._id).not.to.equal(undefined)
        expect(res.body.name).to.equal(entity.name)
        expect(res.body.file).to.equal(entity.file)
        expect(res.body.translations).not.to.equal(undefined)
        expect(res.body.translations.length).to.equal(2)

        done();
      });
  })

  it('GET /api/v1/audio/:id is successful', async done => {

    const entity = await audioService.create({
      name: cid(10),
      file: cid(20),
      translations: [
        {
          locale: 'ru',
          description: cid(30),
        },
        {
          locale: 'ua',
          description: cid(30),
        }
      ]
    })


    app.get(`/api/v1/audio/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)

        done();
      });
  })

  it('PUT /api/v1/audio/:id is successful', async done => {

    const entity = await audioService.create({
      name: cid(10),
      file: cid(20),
      translations: [
        {
          locale: 'ru',
          description: cid(30),
        },
        {
          locale: 'ua',
          description: cid(30),
        }
      ]
    })

    const changes = {
      name: cid(12)
    }

    app.put(`/api/v1/audio/${entity._id}`)
      .type('application/json')
      .send(JSON.stringify(changes))
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.name).to.equal(changes.name)

        done();
      });
  })

  it('DELETE /api/v1/audio/:id is successful', async done => {

    const entity = await audioService.create({
      name: cid(10),
      file: cid(20),
      translations: [
        {
          locale: 'ru',
          description: cid(30),
        },
        {
          locale: 'ua',
          description: cid(30),
        }
      ]
    })

    app.del(`/api/v1/audio/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(204)

        done();
      });
  })
})