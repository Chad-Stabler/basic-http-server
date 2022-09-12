import net from 'net';
import chalk from 'chalk';

const serverLog = (...args) => console.log(chalk.cyan('[server]'), ...args);

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

${body}`
)
            } else if (method == 'GET' && path == '/posts') {
            const jsonBody = { name: 'Chad', age: 21 };
            socket.write(`HTTP/1.1 200 Ok
Content-Length: ${JSON.stringify(jsonBody).length}
Content-Type: application/json

${JSON.stringify(jsonBody)}`);
            } else if (method == 'POST' && path == '/mail') {} else {
                socket.write('You sent' + data.toString().toUpperCase());
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