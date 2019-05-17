const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const morgan = require('morgan')
const cors = require('cors')

const AudioFailsRESTController = require(`./controllers/AudioFailsRESTController`);
const AudioRESTController = require(`./controllers/AudioRESTController`);
const ImageRESTController = require(`./controllers/ImageRESTController`);
const ScenarioRESTController = require(`./controllers/ScenarioRESTController`);
const InventoryRESTController = require(`./controllers/InventoryRESTController`);
const ChapterRESTController = require(`./controllers/ChapterRESTController`);

const ErrorLogger = require(`./services/ErrorLogger`);

const app = express();

app.use(cors());
//app.use(morgan('tiny'))
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/v1', AudioFailsRESTController);
app.use('/api/v1', AudioRESTController);
app.use('/api/v1', ImageRESTController);
app.use('/api/v1', ScenarioRESTController);
app.use('/api/v1', InventoryRESTController);
app.use('/api/v1', ChapterRESTController);

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'not found'
  })
});

app.use(ErrorLogger);

module.exports = app
