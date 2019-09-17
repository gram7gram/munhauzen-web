const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const checkLocale = require('./server/services/RequestParamsValidator').checkLocale

const AudioFailsRESTController = require('./server/controllers/AudioFailsRESTController');
const AudioRESTController = require('./server/controllers/AudioRESTController');
const ImageRESTController = require('./server/controllers/ImageRESTController');
const ScenarioRESTController = require('./server/controllers/ScenarioRESTController');
const InventoryRESTController = require('./server/controllers/InventoryRESTController');
const ChapterRESTController = require('./server/controllers/ChapterRESTController');
const ImportController = require('./server/controllers/ImportController');
const ExportController = require('./server/controllers/ExportController');
const ExpansionRESTController = require('./server/controllers/ExpansionRESTController');
const LoginController = require('./server/controllers/LoginController');

const ErrorLogger = require('./server/services/ErrorLogger');
const isAdmin = require('./server/services/AuthService').isAdmin;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, `../public`)))

//Public API
app.use('/api/v1', LoginController);
app.use('/api/v1/:locale', checkLocale, ExpansionRESTController);
app.use('/api/v1/:locale', checkLocale, ExportController);

//Admin API
app.use('/api/v1/:locale', checkLocale, isAdmin, AudioFailsRESTController);
app.use('/api/v1/:locale', checkLocale, isAdmin, AudioRESTController);
app.use('/api/v1/:locale', checkLocale, isAdmin, ImageRESTController);
app.use('/api/v1/:locale', checkLocale, isAdmin, ScenarioRESTController);
app.use('/api/v1/:locale', checkLocale, isAdmin, InventoryRESTController);
app.use('/api/v1/:locale', checkLocale, isAdmin, ChapterRESTController);
app.use('/api/v1/:locale', checkLocale, isAdmin, ImportController);

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'No route found'
  })
});

app.use(ErrorLogger);

module.exports = app
