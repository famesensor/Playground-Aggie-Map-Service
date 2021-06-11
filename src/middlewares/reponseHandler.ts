import { Request, Response, NextFunction } from 'express';
import { errorReponseExtended } from '../models/error';
import { successReponse } from '../models/reponse';

export const reponseHanler = (
    reponse: errorReponseExtended | successReponse,
    req: Request,
    res: Response,
    next: NextFunction
) => {};
