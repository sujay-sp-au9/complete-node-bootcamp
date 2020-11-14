const fs = require('fs');

// Blocking, Synchronous way
const text = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(text);
const textOut = `This is what we know about avocados:\n${text}\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);

// Non-blocking, Asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if(err) console.log(err);
    else fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        if(err) console.log(err);
        else fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            if(err) console.log(err);
            else fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
                if(err) console.log(err);
                else console.log('File written');
            });
        });
    });
});
console.log('Reading...');