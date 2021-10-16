const express = require('express');
const chalk = require('chalk');
const userRoute = require('./routes/user.route');
const tweetRoute = require('./routes/tweet.route');
const { connectDB, graceFullyCloseDbConnection } = require('./config/dbconfig');

const initializeServer = async () => {
    console.log(chalk.gray('starting server...'));

    const app = express();
    
   await connectDB();
 
    app.use(express.urlencoded({ extended : true}));
    app.use(express.json({ limit : '1mb' }));

    app.use((req,res,next) => {
        req.user = "divya587"
        next();
    })
    app.use(userRoute);
    app.use(tweetRoute);

    app.use((error, req, res, next) => {
        console.log(error);

        if(res.headerSent) {
            return next(error);
        }
        res.status(error.code || 500)
        .json({ message : error.message || "Unknown Error Occured" })
    })

    const PORT = 8000

    const server = app.listen(PORT , () => {
        console.log(chalk.blue(`server running on port ${PORT}`));
        console.log(chalk.blueBright(`local url: http://localhost:${PORT}`));

        return server;
    })
}

module.exports = initializeServer;