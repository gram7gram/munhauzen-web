const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const AudioFailsRESTController = require('./server/controllers/AudioFailsRESTController');
const AudioRESTController = require('./server/controllers/AudioRESTController');
const ImageRESTController = require('./server/controllers/ImageRESTController');
const ScenarioRESTController = require('./server/controllers/ScenarioRESTController');
const InventoryRESTController = require('./server/controllers/InventoryRESTController');
const ChapterRESTController = require('./server/controllers/ChapterRESTController');
const ImportController = require('./server/controllers/ImportController');
const ExportController = require('./server/controllers/ExportController');

const ErrorLogger = require('./server/services/ErrorLogger');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', AudioFailsRESTController);
app.use('/api/v1', AudioRESTController);
app.use('/api/v1', ImageRESTController);
app.use('/api/v1', ScenarioRESTController);
app.use('/api/v1', InventoryRESTController);
app.use('/api/v1', ChapterRESTController);
app.use('/api/v1', ImportController);

app.use(ExportController);

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'not found'
  })
});

app.use(ErrorLogger);

module.exports = app
