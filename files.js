const fs = require('fs');
const os = require('os')
// console.log(os.cpus().length)
// const res = fs.readFileSync('./text.txt', 'utf-8');

// console.log(res)

fs.writeFile('./text.txt', 'Hello Miheer', (err, res) => {
    console.log(res)
})
