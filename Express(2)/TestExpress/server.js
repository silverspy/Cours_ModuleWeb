const fs = require('fs');
const express = require('express');
const path = require('path');
var file = process.argv[2];
var content;
const app = express();

if(!file){
    console.error('Missing argument. Please give file name. Example node script.js test.csv');
    process.exit(1)
}

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => res.send("hello World"));

app.get('/user/:id', function(req, res) {
    res.send('user ' + req.params.id)
})

app.listen(port, () => console.log("ok"));