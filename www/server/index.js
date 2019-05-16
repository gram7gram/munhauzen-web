const express = require('express');

const IndexController = require(`./controllers/IndexController`);
const ErrorLogger = require(`./services/ErrorLogger`);

const app = express();

app.use(express.static(`./public`));

app.use(IndexController);

app.use(ErrorLogger);

app.listen(process.env.PORT, () => {
  console.log('Server started')
});
