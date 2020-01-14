const {boot, expect} = require('../../WebTestCase')

describe('ExpansionRESTController', () => {

  const products = [
    'free',
    'full_munchausen_audiobook_eng',
    'part2_munchausen_audiobook_eng',
    'part1_munchausen_audiobook_eng'
  ]

  const dpis = ['mdpi', 'hdpi']
  const locales = ['en', 'ru']
  const versions = [1]

  let app

  before(() => {
    app = boot()
  })

  locales.forEach(locale => {
    versions.forEach(version => {
      dpis.forEach(dpi => {

        it(`GET /api/v1/${locale}/expansions/${version}/${dpi} without 'product' is forbidden`, done => {

          app.get(`/api/v1/${locale}/expansions/${version}/${dpi}`)
            .end((err, res) => {

              expect(res.statusCode).to.equal(400)

              done();
            });

        })

        products.forEach(product => {

          it(`GET /api/v1/${locale}/expansions/${version}/${dpi}?product=${product} is successful`, done => {

            app.get(`/api/v1/${locale}/expansions/${version}/${dpi}?product=${product}`)
              .end((err, res) => {

                expect(res.statusCode).to.equal(200)

                done();
              });

          })
        })
      })
    })
  })

})