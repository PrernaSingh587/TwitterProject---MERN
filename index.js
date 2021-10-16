const chalk = require('chalk');
const initializeServer = require('./src/server');

const main = async () => {
    const server = await initializeServer();
}

main();