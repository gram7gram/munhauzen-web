const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan')
const {detectLocale} = require('./i18n')

const publicDir = path.resolve(__dirname, '../public')

const router = new express.Router({mergeParams: true});

const IndexController = require('./controllers/IndexController');

const app = express();

app.use(cors())
app.use(morgan('tiny'))

app.use(express.static(publicDir))

router.get('/', detectLocale, IndexController.index)
router.get('/privacy', detectLocale, IndexController.privacy)

router.get('/:locale', detectLocale, IndexController.index)
router.get('/:locale/privacy', detectLocale, IndexController.privacy)

app.use(router)

app.use('*', (req, res) => {
  res.status(404).send('Not found')
})

module.exports = app