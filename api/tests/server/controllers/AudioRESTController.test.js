const {boot, expect, tearDown} = require('../../WebTestCase')

describe('AudioRESTController', () => {

  let app

  before(() => {
    app = boot()
  })

  after(tearDown)

  it('GET /api/v1/audio is successful', (done) => {

    app.get('/api/v1/audio')
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.items).not.to.equal(undefined)
        expect(res.body.count).not.to.equal(undefined)

        done();
      });
  })
})