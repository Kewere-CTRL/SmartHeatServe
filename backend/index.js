const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/route');
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config();

const PORT = process.env.SERVER_PORT;

let database = require('./models/database');

const ObjectServices = require('./services/ObjectServices');
const objectServices = new ObjectServices();

const start = async () => {
    try {
        const app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.use(cors({
            origin: [
                'http://localhost:' + process.env.HOST,
                'http://'+ process.env.HOST + ':' + process.env.API_DEV,
            ],
            credentials: true,
        }));
        app.use('/api', router);
        app.use(errorMiddleware);

        database = await database({
            name: process.env.DATABASE_NAME,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dialect: process.env.DATABASE_DIALECT,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            logging: process.env.DATABASE_LOGGING === 'true',
        });

        module.exports.publicSchema = database.publicSchema;
        module.exports.query = database.query;

        objectServices.startPeriodicRequest();

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error synchronizing database:', error.message, error.stack);
        process.exit(1);
    }
};

start();
