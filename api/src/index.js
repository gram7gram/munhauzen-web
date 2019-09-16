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

const ErrorLogger = require('./server/services/ErrorLogger');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/:locale', checkLocale, AudioFailsRESTController);
app.use('/api/v1/:locale', checkLocale, AudioRESTController);
app.use('/api/v1/:locale', checkLocale, ImageRESTController);
app.use('/api/v1/:locale', checkLocale, ScenarioRESTController);
app.use('/api/v1/:locale', checkLocale, InventoryRESTController);
app.use('/api/v1/:locale', checkLocale, ChapterRESTController);
app.use('/api/v1/:locale', checkLocale, ImportController);
app.use('/api/v1/:locale', checkLocale, ExportController);
app.use('/api/v1/:locale', checkLocale, ExpansionRESTController);

app.use(express.static(path.resolve(__dirname, `../public`)))

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'not found'
  })
});

app.use(ErrorLogger);

module.exports = app
