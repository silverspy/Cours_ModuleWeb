const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const mongoose = require("mongoose");
const pug = require("pug");

mongoose.connect("mongodb://localhost/TP_Web", { useNewUrlParser: true});
const db = mongoose.connection;

db.once("open",function() {
    console.log("Connected to Mongo")
});
db.on("error", console.error.bind(console, "connection error:"));

//Schema
const citySchema = new mongoose.Schema({
    id: { type: String, unique: true, default: uuidv4() },
    name: { type: String, unique: false }
})

//Model
const City = mongoose.model('City', citySchema)

//Check city already exist in cities
const alreadyExist = (cities, city) => {
    for (let c of cities) {
        if (city.name === c.name) {
            return true
        }
    }
    return false
}

const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/cities', (req, res) => {
    City.find(function (err, cities) {
        if (err) {
            res.json({
                error: err
            })
        }
        const compiledFunction = pug.compileFile(path.join(__dirname,'./template.pug'));

        let content = compiledFunction({
            citiess : cities
        })

        res.send(content)

    })
})

app.post('/city', bodyParser.json(), (req, res, next) => {
    const city = {
        id: uuidv4(),
        name: req.body.name,
    }
    City.find(function (err, cities) {
        if (err) {
            res.json({
                error: err
            })
        }
        if (alreadyExist(cities, city)) {
            res.json({ error: 'City already exists' })
        } else {
            City.create(city, (err, city) => {
                if (err) {
                    res.json({
                        error: err4
                    })
                }
                res.redirect('/cities')
                //res.send(city);
            })        
        }
    })
})

app.put('/city/:id', bodyParser.json(), (req, res) => {
    const city = {
        name: req.body.name,
    }

    City.findOneAndUpdate({ id: req.params.id }, city, {new: true}, (err,doc) => {
        if (err) {
            res.json({
                error: err
            })
        }
        res.redirect('/cities')
    });

})

app.delete('/city/:id', bodyParser.json(), (req, res) => {
    City.findOneAndDelete({ id: req.params.id }, (err,doc) => {
        if (err) {
            res.json({
                error: err
            })
        }
        res.redirect('/cities')
    });
})


app.listen(port, () => console.log("ok"));