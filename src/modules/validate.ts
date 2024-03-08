// A function to be passed into the route handler to validate the request body

import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../shared/error';

export function validateBody(schema: Joi.Schema): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);

      if (error) {
        res.json({ validationError: error.details[0].message });
        throw new NotFoundError(error.details[0].message);
      }

      req.body = schema.validate(req.body).value; // Assign validated body back to req.body
      next();
    } catch (e) {
      next(e); // Pass unexpected errors to the next error handler
    }
  };
}
