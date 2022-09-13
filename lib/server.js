import net from 'net';
import chalk from 'chalk';

const serverLog = (...args) => {
    if (process.env['NODE_ENV'] !== 'test') {
    console.log(chalk.cyan('[server]'), ...args);
  };
}
export const serve = (host, port) => {

    const server = net.createServer((socket) => {
        serverLog('A peer connected!')
        socket
          .on('data', (data) => {
            const dataStr = data.toString();
            serverLog('Got data:', data.toString());
            const lines = dataStr.split('\n');
            const startLine = lines[0];
            const [method, path, ] = startLine.split(' ');
            if(method == 'GET' && path == '/') {
                const body = `<html>
                <main>
                <h1>Chad's blog</h1>
                <article>
                
                <h2>A thing about Chad</h2>
                <p>He likes food when stressed</p>
                </article>
                </main>
                </html>`;
                socket.write(`HTTP/1.1 200 Ok
Content-Length: ${body.length}
Content-Type: text/html

${body}`
)
            } else if (method == 'GET' && path == '/posts') {
            const jsonBody = { name: 'Chad', age: 21 };
            socket.write(`HTTP/1.1 200 Ok
Content-Length: ${JSON.stringify(jsonBody).length}
Content-Type: application/json

${JSON.stringify(jsonBody)}`);
            } else if (method == 'POST' && path == '/mail') {
                socket.write(`HTTP/1.1 204 No Content
Content-Length: 0
Content-Type: application/json


`);
            } else {
                const notFound = `<html><h2>404 Not Found</h2></html>`
                socket.write(`HTTP/1.1 404 Not Found
Content-Length: ${notFound.length}
Accept: application/json, text/html

${notFound}
`);
            }
        });
        socket.on('end', () => {
            serverLog('client disconnected');
        });
        socket.on('error', (err) => {
            serverLog('Got error:', err);
        });
        });
    server.listen(port, host, () => {
        serverLog('Server is up!');
    });
    serverLog('Attempting to start server');
    return server;
}