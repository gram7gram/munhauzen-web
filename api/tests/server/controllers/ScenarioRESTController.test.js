const {boot, expect, tearDown} = require('../../WebTestCase')

describe('ScenarioRESTController', () => {

  let app

  before(() => {
    app = boot()
  })

  after(tearDown)

  it('GET /api/v1/scenario is successful', (done) => {

    app.get('/api/v1/scenario')
      .end((err, res) => {

        expect(res.statusCode).to.equal(200)
        expect(res.body.items).not.to.equal(undefined)
        expect(res.body.count).not.to.equal(undefined)

        done();
      });
  })
})