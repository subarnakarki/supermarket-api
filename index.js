' use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const produceArr = [
    {
        name: 'Lettuce',
        code: 'A12T-4GH7-QPL9-3N4M',
        price: 3.46
    },
    {
        name: 'Peach',
        code: 'E5T6-9UI3-TH15-QR88',
        price: 2.99
    },
    {
        name: 'Green Pepper',
        code: 'YRT6-72AS-K736-L4AR',
        price: 0.79
    },
    {
        name: 'Gala Apple',
        code: 'TQ4C-VV6T-75ZX-1RMR',
        price: 3.59
    }
];

app.use(bodyParser.urlencoded({ extended: true}));

function checkInventory (name) {
    if (!name) {
        return false;
    }
    for (let i = 0; i < produceArr.length; i++) {
        if (produceArr[i].name.toUpperCase() === name.toUpperCase()) {
            return {name, i};
        }
    }
    return false;
}

app.get('/', (req,res) => {
    res.send('Homepage');
});

app.get('/produce', (req,res) => {
    const name = req.query.name
    const uppercase = req.query.uppercase;
    if (!name && !uppercase) {
        res.send(produceArr);
    }
    if (name) {
        const produceInStock = checkInventory(name);
        if (!uppercase && produceInStock) {
                res.send(produceArr[produceInStock.i].name)
            }
        if (uppercase  === "true" && produceInStock) {
            res.send(produceArr[produceInStock.i].name.toUpperCase());
        }
         if (!produceInStock) {
            res.send(`We are out of ${name}(s)`);
        }
    }
});

app.post('/produce', (req, res) => {
    const produceProperties = [ 'name', 'code', 'price']
    const missingProp = [];
    let newProduce = {
        name: req.body.name,
        code: req.body.code,
        price: req.body.price,
    };

    produceProperties.forEach((prop) => {
        if (!newProduce[prop]) {
            missingProp.push(` ${prop}`);
        }
    });

    if (missingProp.length > 0) {
        res.send(`You are missing the following properties in your request: ${missingProp}`);
    }
    
    produceArr.push(newProduce);
    res.redirect('/produce');
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});