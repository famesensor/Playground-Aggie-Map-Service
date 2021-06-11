import { Request, Response, NextFunction } from 'express';
import { errorReponseExtended } from '../models/error';

export const errorHandler = (
    err: errorReponseExtended,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = { ...err };

    error.message = err.message;

    if (error.validateError) {
        error.errors = error.validateError;
    }

    res.status(err.statusCode || 500).json({
        message: error.message,
        errors: error.errors
    });
};
