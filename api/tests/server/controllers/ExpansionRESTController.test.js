const {boot, expect, tearDown} = require('../../WebTestCase')

describe('ExpansionRESTController', () => {

  const devices = ['tablet', 'phone']
  const dpis = ['mdpi', 'hdpi', 'xhdpi']
  const i18ns = ['en', 'ua', 'ru']
  const versions = [1]

  let app

  beforeEach(() => {
    app = boot()
  })

  afterEach(tearDown)

  devices.forEach(device => {
    dpis.forEach(dpi => {
      i18ns.forEach(i18n => {
        versions.forEach(version => {

          it(`GET /api/v1/expansions/${version}/${i18n}/${device}/${dpi} is successful`, done => {

            app.get(`/api/v1/expansions/${version}/${i18n}/${device}/${dpi}`)
              .end((err, res) => {

                expect(res.statusCode).to.equal(200)
                expect(res.body.version).to.equal(version)

                done();
              });

          })

        })
      })
    })
  })

  it(`GET /api/v1/expansions with invalid device is not successful`, done => {

    app.get(`/api/v1/expansions/1/en/IPHONE/hdpi`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(400)

        done();
      });

  })

  it(`GET /api/v1/expansions with invalid i18n is not successful`, done => {

    app.get(`/api/v1/expansions/1/KZ/tablet/hdpi`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(400)

        done();
      });

  })

  it(`GET /api/v1/expansions with invalid dpi is not successful`, done => {

    app.get(`/api/v1/expansions/1/en/tablet/XXXHDPI`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(400)

        done();
      });

  })

  it(`GET /api/v1/expansions with invalid version is not successful`, done => {

    app.get(`/api/v1/expansions/10000/en/tablet/hdpi`)
      .end((err, res) => {

        expect(res.statusCode).to.equal(400)

        done();
      });

  })


})