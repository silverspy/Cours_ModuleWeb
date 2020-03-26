const fs = require('fs')
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');


const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/cities', (req, res) => {
    if (!fs.existsSync(path.join(__dirname, 'cities.json'))) {
        res.status(404).send('Sorry, no files found')
    } else {
        fs.readFile(path.join(__dirname, 'cities.json'), 'utf-8', (err, data) => {
            if (err) {
                res.status(500).send('Error')
                console.log(err)
            } else {
                res.send(data)
            }
        })
    }
})

app.post('/city', bodyParser.json(), (req, res, next) => {
    const city = req.body
    if (!fs.existsSync(path.join(__dirname, 'cities.json'))) {
        const object = {}
        object.cities = []
        let json = JSON.stringify(object)
        fs.writeFileSync(path.join(__dirname, 'cities.json'), json)
    }

    fs.readFile(path.join(__dirname, 'cities.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error');
            console.log(err);
        } else {
            const object = JSON.parse(data);
            if (object.cities.some(c => c.name === city.name)) {
                res.status(500).send('City already exist');
            } else {
                object.cities.push({
                    id: uuidv4(),
                    name: city.name
                });
                const json = JSON.stringify(object);
                fs.writeFileSync(path.join(__dirname, 'cities.json'), json);
                res.send(json);
            }
        }
    })

})

app.put('/city/:id', bodyParser.json(), (req, res) => {
    const city = req.body
    if (fs.existsSync(path.join(__dirname, 'cities.json'))) {
        fs.readFile(path.join(__dirname, 'cities.json'), (err, data) => {
            if (err) {
                res.status(500).send('Error');
                console.log(err);
            } else {
                const files = JSON.parse(data)
                const index = files.cities.findIndex(c => c.id === city.id)
                if (index === -1) {
                    res.sendStatus(404)
                } else {
                    files.cities[index].name = city.name
                    const json = JSON.stringify(files)
                    fs.writeFileSync(path.join(__dirname, 'cities.json'), json)
                    res.send(json)
                }
            }
        })
    } else {
        console.log('File do not exists')
        res.status(404).send('No file');
    }
})

app.delete('/city/:id', bodyParser.json(), (req, res) => {
    const id = req.params.id
    if (fs.existsSync(path.join(__dirname, 'cities.json'))) {
        fs.readFile(path.join(__dirname, 'cities.json'), (err, data) => {
            if (err) {
                res.status(500).send('Error');
                console.log(err);
            } else {
                const files = JSON.parse(data)
                const index = files.cities.findIndex(city => city.id === id)
                if (index === -1) {
                    res.status(500).send('No city');
                } else {
                    files.cities = files.cities.filter(c => c.id !== id)
                    const json = JSON.stringify(files)
                    fs.writeFileSync(path.join(__dirname, 'cities.json'), json)
                    res.send(json)
                }
            }
        })
    } else {
        console.log('File do not exists')
        res.status(404).send('No file');
    }
})

app.listen(port, () => console.log("ok"));