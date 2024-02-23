import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { env } from './config/env';
import { Logger } from './shared/logger';

const app = express();
const logger =  new Logger();

app.use( (req, res, done) => {
    logger.info(`${req.method} - ${req.url} - ${req.ip}`);
    done();
})
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
});

