const fs = require('fs')
var file = process.argv[2];

if(!file){
    console.error('Missing argument. Please give file name. Example node script.js test.csv');
    process.exit(1)
}

fs.readFile(file,'utf8', (err,data) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(data)
})