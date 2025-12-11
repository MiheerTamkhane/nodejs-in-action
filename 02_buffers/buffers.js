const {Buffer} = require('buffer');

const buf1 = Buffer.alloc(5);
console.log('Buffer 1:', buf1);

const buf2 = Buffer.from([1, 2, 3, 4, 5]);
console.log('Buffer 2:', buf2);

const buf3 = Buffer.from('Hello, World!', 'utf8');
console.log('Buffer 3:', buf3);
console.log('Buffer 3:', buf3.toString());

const buf4 = Buffer.from('Miheer');
buf4[0] = 0x6c; // ASCII for 'l'
console.log('Buffer 4:', buf4);
console.log('Buffer 4:', buf4.toString());

const bufX = Buffer.from('First');
const bufY = Buffer.from(' Second');
const mergedBuf = Buffer.concat([bufX, bufY]);
console.log('Merged Buffer:', mergedBuf);
console.log('Merged Buffer:', mergedBuf.toString());