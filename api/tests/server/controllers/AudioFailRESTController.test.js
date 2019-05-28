const {boot, expect, tearDown} = require('../../WebTestCase')
const audioFailService = require('../../../src/server/services/AudioFailService')
const {cid} = require('../../utils')

describe('AudioFailRESTController', () => {

  let app

  beforeEach(() => {
    app = boot()
  })

  afterEach(tearDown)

  it('GET /api/v1/audio-fails is successful', (done) => {

    app.get('/api/v1/audio-fails')
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.items).not.to.equal(undefined)
        expect(res.body.count).not.to.equal(undefined)

        done();
      });
  })

  it('POST /api/v1/audio-fails is successful', (done) => {

    const entity = {
      name: cid(10),
      file: cid(20),
      audio: cid(20),
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

    app.post('/api/v1/audio-fails')
      .type('application/json')
      .send(JSON.stringify(entity))
      .end((err, res) => {

        expect(res.statusCode).to.equal(201)
        expect(res.body._id).not.to.equal(undefined)
        expect(res.body.audio).to.equal(entity.audio)
        expect(res.body.name).to.equal(entity.name)
        expect(res.body.file).to.equal(entity.file)
        expect(res.body.translations).not.to.equal(undefined)
        expect(res.body.translations.length).to.equal(2)

        done();
      });
  })

  it('GET /api/v1/audio-fails/:id is successful', (done) => {

    const entity = audioFailService.create({
      name: cid(10),
      file: cid(20),
      audio: cid(20),
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


    app.get(`/api/v1/audio-fails/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)

        done();
      });
  })

  it('PUT /api/v1/audio-fails/:id is successful', (done) => {

    const entity = audioFailService.create({
      name: cid(10),
      file: cid(20),
      audio: cid(20),
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

    app.put(`/api/v1/audio-fails/${entity._id}`)
      .type('application/json')
      .send(JSON.stringify(changes))
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.name).to.equal(changes.name)

        done();
      });
  })

  it('DELETE /api/v1/audio-fails/:id is successful', (done) => {

    const entity = audioFailService.create({
      name: cid(10),
      file: cid(20),
      audio: cid(20),
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

    app.del(`/api/v1/audio-fails/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(204)

        done();
      });
  })
})