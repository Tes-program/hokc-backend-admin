import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { Logger } from './logger';

const logger = new Logger();

export const validationErrorHandler = (error: ValidationError, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    logger.error(`Validation error: ${error.message}`);
    res.status(400).send('Bad request');
  } else {
    next();
  }
};


