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

app.get("/", function(req, res) {
    fs.readFile(file,'utf8', (err,data) => {
        if (err) {
            console.error(err)
            res.status(500).send('Sorry, no files found')
            process.exit(1)
        }

        var results = data.toString().split(/\r\n|\n/)
        var tab = '<table>';
        
        for (let result of results) {
            user = result.split(';');
            tab += `<tr><td>${user[0]}</td><td>${user[1]}</td></tr>`
        }
        
        tab += '<style type="text/css">td { border-bottom: 1px solid #ddd; }</style>'
        tab += '</table>';

        res.status(200).send(tab)

        
    })

});

app.listen(port, () => console.log("ok"));

/*
const server = http.createServer(
    (req, res) => {
        const generatedTemplate = compiledFunction({
            name: 'test'
        })

        fs.readFile(file,'utf8', (err,data) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            var results = data.toString().split(/\r\n|\n/)
            var tab = '<table>';
            for (let result of results) {
                user = result.split(';');
                tab += `<tr><td>${user[0]}</td><td>${user[1]}</td></tr>`
            }
            tab += '<style type="text/css">td { border-bottom: 1px solid #ddd; }</style>'
            tab += '</table>';

            
        res.statusCode = 200;
        res.setHeader('Content-Type','text/html')
        res.end(generatedTemplate + tab)
        })
    }
)

server.listen(port, () => {
    console.log('Server running at port' + port)
}) */