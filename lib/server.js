import net from 'net';
import chalk from 'chalk';

const serverLog = (...args) => console.log(chalk.cyan('[server]'), ...args);

export const serve = (host, port) => {

    const server = net.createServer((socket) => {
        serverLog('A peer connected!')
        socket
          .on('data', (data) => {
            serverLog('Got data:', data.toString());
            socket.write('You sent' + data.toString().toUpperCase());
        })
        .on('close', () => {
            serverLog('client disconnected');
        })
        });
    server.listen(port, host, () => {
        serverLog('Server is up!');
    });
    serverLog('Attempting to start server');
    return server;
}