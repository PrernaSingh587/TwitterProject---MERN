const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
    try {
        const URI = 'mongodb+srv://root:root@cluster0.s7y1w.mongodb.net/Twitter?retryWrites=true&w=majority';
         const conn = await mongoose.connect(URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         });

         console.log(chalk.green(`MongoDb Connected : ${conn.connection.host}`));

    } catch(error) {
        console.log(chalk.red(`Error connecting to MongoDb : ${error}`));
    }
}

const graceFullyCloseDbConnection = () => {
    mongoose.connection.close(() => {
        console.log(chalk.black.bgYellow('Closing mongoose connection...'));
        process.exit(0);
    })
}

module.exports = {
    connectDB,
    graceFullyCloseDbConnection
}