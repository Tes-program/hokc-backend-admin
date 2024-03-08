import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { env } from './config/env';
import { Logger } from './shared/logger';
import { router } from './shared/router';

const app = express();
const logger =  new Logger();

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

app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT} 🚀`);
});

