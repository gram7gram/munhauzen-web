const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const AudioFailsRESTController = require(`./controllers/api/AudioFailsRESTController`);
const AudioRESTController = require(`./controllers/api/AudioRESTController`);
const ImageRESTController = require(`./controllers/api/ImageRESTController`);
const ScenarioRESTController = require(`./controllers/api/ScenarioRESTController`);
const ErrorLogger = require(`./services/ErrorLogger`);

const app = express();

// CORS
app.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.removeHeader('x-powered-by');

  next();

});

app.use(bodyParser.json());

app.use(cookieParser());

// Configure routes
app.use('/api/v1/:locale', AudioFailsRESTController);
app.use('/api/v1/:locale', AudioRESTController);
app.use('/api/v1/:locale', ImageRESTController);
app.use('/api/v1/:locale', ScenarioRESTController);

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'not found'
  })
});

app.use(ErrorLogger);

app.listen(process.env.PORT, () => {
  console.log('Server started')
});
