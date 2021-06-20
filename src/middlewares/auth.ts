import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { jwtClaims } from '../models/user';
import { ErrorReponse } from '../utils/error/errorReponse';

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        let token = req.headers.authorization.split('Bearer ')[1];

        try {
            let verify = jwt.verify(
                token,
                process.env.SECRET_KEY!
            ) as jwtClaims;

            req.user = {
                user_id: verify.user_id
            };

            next();
        } catch (error) {
            next(new ErrorReponse('invalid token', 401));
        }
    } else {
        next(new ErrorReponse('invalid token', 401));
    }
};
