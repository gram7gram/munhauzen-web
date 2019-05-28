const {boot, expect, tearDown} = require('../../WebTestCase')
const imageService = require('../../../src/server/services/ImageService')
const {cid} = require('../../utils')

describe('ImageRESTController', () => {

  let app

  beforeEach(() => {
    app = boot()
  })

  afterEach(tearDown)

  it('GET /api/v1/images is successful', async done => {

    app.get('/api/v1/images')
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.items).not.to.equal(undefined)
        expect(res.body.count).not.to.equal(undefined)

        done();
      });
  })

  it('POST /api/v1/images is successful', async done => {

    const entity = {
      name: cid(10),
      file: cid(20),
      translations: [
        {
          locale: 'ru',
          description: cid(30),
          statusTitle: cid(5)
        },
        {
          locale: 'ua',
          description: cid(30),
          statusTitle: cid(5)
        }
      ]
    }

    app.post('/api/v1/images')
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

  it('GET /api/v1/images/:id is successful', async done => {

    const entity = await imageService.create({
      name: cid(10),
      file: cid(20),
      translations: [
        {
          locale: 'ru',
          description: cid(30),
          statusTitle: cid(5)
        },
        {
          locale: 'ua',
          description: cid(30),
          statusTitle: cid(5)
        }
      ]
    })


    app.get(`/api/v1/images/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)

        done();
      });
  })

  it('PUT /api/v1/images/:id is successful', async done => {

    const entity = await imageService.create({
      name: cid(10),
      file: cid(20),
      translations: [
        {
          locale: 'ru',
          description: cid(30),
          statusTitle: cid(5)
        },
        {
          locale: 'ua',
          description: cid(30),
          statusTitle: cid(5)
        }
      ]
    })

    const changes = {
      name: cid(12)
    }

    app.put(`/api/v1/images/${entity._id}`)
      .type('application/json')
      .send(JSON.stringify(changes))
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.name).to.equal(changes.name)

        done();
      });
  })

  it('DELETE /api/v1/images/:id is successful', async done => {

    const entity = await imageService.create({
      name: cid(10),
      file: cid(20),
      translations: [
        {
          locale: 'ru',
          description: cid(30),
          statusTitle: cid(5)
        },
        {
          locale: 'ua',
          description: cid(30),
          statusTitle: cid(5)
        }
      ]
    })

    app.del(`/api/v1/images/${entity._id}`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(204)

        done();
      });
  })
})