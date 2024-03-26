import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { env } from './config/env';
import { Logger } from './shared/logger';
import { router } from './shared/router';
import * as redis from 'redis';

const app = express();
const logger =  new Logger();

export const redisClient = redis.createClient({
    url: env.REDIS_URL
});

app.use( (req, _res, done) => {
    logger.info(`${req.method} - ${req.url} - ${req.ip} 💻`);
    done();
})
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get('/', (_req, res) => {
    res.send('Welcome to HOKC Admin API, you should not be here 🚀');
});

(async () => {
    redisClient.on('error', (err) => {
        logger.error(`Redis error: ${err}`);
    });
    redisClient.on('connect', () => 
        logger.info('Redis is connected 🚀'));
        await redisClient.connect();

        await redisClient.ping();
})();

app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT} 🚀`);
});

