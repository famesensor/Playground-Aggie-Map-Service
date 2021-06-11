import { Request, Response, NextFunction } from 'express';
import { errorReponseExtended } from '../models/error';

export const reponseHanler = (
    err: errorReponseExtended,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);

    res.status(err.statusCode);
};
