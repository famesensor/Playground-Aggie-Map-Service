import jwt from 'jsonwebtoken';
import { jwtClaims } from '../../models/user';

export const jwtGenerate = (claim: jwtClaims): string => {
    return jwt.sign(claim, process.env.SECRET_KEY!, { expiresIn: 86400 });
};
