const http = require("http");
const url = require('url');
const fs = require('fs');

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%TNUTRIENTS%}/g, product.productName);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic)  output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res)=>{

    const {query, pathname } = url.parse(req.url, true)
    //OVERVIEW PAGE
    if(pathname == "/" || pathname == "/overview"){
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cards = dataObj.map( elm => replaceTemplate(tempCard, elm)).join(' ');
        const output = tempOverview.replace( '{%PRODUCT_CARDS%}', cards);
        res.end(output);
    } 
    
    //PRODUCT PAGE
    else if( pathname == "/product"){
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product)
        res.end(output);
    } 
    
    //NOT FOUND PAGE
    else{
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("<h1>404 Error, Page not found</h1>");
    }
});

server.listen(2021, "127.0.0.1", () =>{
    console.log('Listening at port 2021');
});
