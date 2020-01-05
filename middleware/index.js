const { check } = require('express-validator');
const { produceData } = require('../produceData');

const validateInput = [
  check('name').isLength({ min: 3 }),
  check('code').matches(/\w{4}[-]?\w{4}[-]?\w{4}[-]?\w{4}/).isLength({ min: 19, max: 19 }),
  check('price').isNumeric(),
];

const checkProduce = (name) => {
  if (name) {
    for (let i = 0; i < produceData.length; i++) {
      if (produceData[i].name.toLowerCase() === name.toLowerCase()) {
        return produceData[i];
      }
    }
  }
  return false;
};

module.exports = {
  validateInput,
  checkProduce,
};
