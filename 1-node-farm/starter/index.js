const fs = require('fs');
const http = require('http');
const url = require('url');

// // Blocking, Synchronous way
// const text = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(text);
// const textOut = `This is what we know about avocados:\n${text}\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

// // Non-blocking, Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) console.log(err);
//     else fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         if(err) console.log(err);
//         else fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             if(err) console.log(err);
//             else fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 if(err) console.log(err);
//                 else console.log('File written');
//             });
//         });
//     });
// });
// console.log('Reading...');

// FILES
/////////////////////////////////////////////////////////////////////////////////////////////////////
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%PRODUCTNUTRIENTSNAMEs%}/g, product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    
    return output;
};

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempView = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const productData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'));

const server = http.createServer((req, res) => {
    let { query, pathname } = url.parse(req.url, true);
    query = JSON.parse(JSON.stringify(query));
    switch(pathname){
        // Overview page
        case '/overview':
        case '/':
            res.writeHead(200, {
                'Content-type': 'html'
            });

            const cardsHtml = productData.map(element => replaceTemplate(tempView, element)).join('');
            const overviewOutput = tempOverview.replace('{%PRODUCT_CARDs%}', cardsHtml);

            res.end(overviewOutput);
            break;

        // Product page
        case '/product':
            res.writeHead(200, {
                'Content-type': 'text/html'
            });
            const product = productData[query.id];
            const productOutput = replaceTemplate(tempProduct, product);
            res.end(productOutput);
            break;

        // API
        case '/api':
            res.writeHead(200, {
                'Content-type': 'application/json'
            });
            res.end(JSON.stringify(productData));
            break;

        // NOT FOUND
        default:
            res.writeHead(404, {
                'Content-type': 'text/html'
            });
            res.end('<h1><strong>Nice try</strong></h1>');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log("Listening to request on port 3000");
});

// SERVER
//////////////////////////////////////////////////////////////////////////////////////////////////////////