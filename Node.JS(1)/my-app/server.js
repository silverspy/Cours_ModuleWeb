const http = require('http');
const pug = require("pug");
const fs = require('fs')
var file = process.argv[2];
var content;

if(!file){
    console.error('Missing argument. Please give file name. Example node script.js test.csv');
    process.exit(1)
}

const compiledFunction = pug.compileFile('./template.pug')
const port = 3000;

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
})