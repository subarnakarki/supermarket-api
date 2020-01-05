' use strict';

const express = require('express');
const bodyParser = require('body-parser'); // https://github.com/expressjs/body-parser/blob/master/README.md
const { validationResult } = require('express-validator'); // https://flaviocopes.com/express-validate-input/

const app = express();
const PORT = process.env.PORT || 3000;

const { produceData } = require('./produceData');
const { validateInput, checkProduce } = require('./middleware');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Supermarket Homepage');
});

// GET PRODUCE
app.get('/produce', (req, res, next) => {
  const queryName = req.query.name;
  const queryUpperCase = req.query.upperCase;
  const foundProduce = queryName ? checkProduce(queryName) : false;
  if (queryName && foundProduce) {
    return res.send(queryUpperCase === 'true' ? foundProduce.name.toUpperCase() : foundProduce.name);
  }
  const produceNames = [];
  produceData.forEach((produce) => {
    const { name } = produce;
    produceNames.push(queryUpperCase === 'true' ? name.toUpperCase() : name);
  });
  res.send(produceNames);
});

// CREATE PRODUCE
app.post('/produce', validateInput, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const newProduceData = {
    name: req.body.name,
    code: req.body.code,
    price: req.body.price,
  };
  checkProduce(newProduceData.name) ? console.log('"Produce" or "Code" already exists') : produceData.push(newProduceData);
  return res.redirect('/produce');
});

app.delete('/produce', (req, res) => {
  const { name } = req.body;
  const produceIndex = produceData.findIndex((produce) => produce.name === name);
  if (produceIndex > -1) {
    produceData.splice(produceIndex, 1);
  }
  return res.redirect('/produce');
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
