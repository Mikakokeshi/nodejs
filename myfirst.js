const { jsonResponse } = require('./utils'); // Use exported function
const HTTP = require('http');
const URL = require('url');
const server = HTTP.createServer((req, res) => {
    try {
        const urlComponents = URL.parse(req.url);
        switch (urlComponents.pathname) { // Which route shall we handle?
        case '/example.json':
            jsonResponse(res, { // JSON response
                example: true,
                random: Math.random(), // A randomised number
                time: (new Date()).toUTCString() // The current date & time
            });
            break;
        case '/home':
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write("The date and time is currently: ");
          res.end();
          break;
        case '/error':
	        null.somethingWrong(); // Invalid code: will throw an exception
	        break;
        default: // All others
            res.writeHead(404); // 404 is Not Found error
            res.end('Page not found: ' + urlComponents.pathname);
            break;
        }
    }
    catch(error) { // Handle internal exceptions, so we don’t just crash
        console.error(error); // For our server logs
        res.writeHead(500); // Tell the user ‘internal server error’.
        res.end('Whoops!');
    }
});

server.on('clientError', (err, socket) => {
    // Send raw HTTP 400 error down the socket
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// Listen on port 3000
server.listen(3001, function() {
    console.log('Started on port', 3001);
});
