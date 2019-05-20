const {boot, expect, tearDown} = require('../../WebTestCase')

describe('IndexController', () => {

  let app

  beforeEach(() => {
    app = boot()
  })

  afterEach(tearDown)

  const routes = ['/', '/images', '/audio', '/audio-fails', '/scenario']

  routes.forEach(route => {

    it(`GET ${route} is successful`, (done) => {

      app.get(route)
        .end((err, res) => {

          expect(res.statusCode).to.equal(200)

          done();
        });
    })

  })
})
