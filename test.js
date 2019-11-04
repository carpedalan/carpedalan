console.log('process', process.env);
console.log('private', process.env.PRIVATE_KEY);
const http = require('http');

const port = 80;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, newzzz!\n');
});

server.listen(port, () => {
  console.log(`Server running at`);
});
