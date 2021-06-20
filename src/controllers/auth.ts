import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

// database...
import { admin, db } from '../configs/firebase.config';

// handler...
import { asyncHandler } from '../middlewares/asyncHandler';

// interface...
import {
    signUpCredentials,
    userInterface,
    signInCredentials,
    jwtClaims
} from '../models/user';

// uuidgen
import { uuidGen } from '../utils/uidgen/uidgen';

// jwt...
import { jwtGenerate } from '../utils/jwt/jwt';

// validate...
import { signupValidate, singInValidate } from '../utils/validation/index';

// error reponse
import { ErrorReponse } from '../utils/error/errorReponse';

const users = db.collection('users');
const FieldValue = admin.firestore.FieldValue;

// signup...
export const signUp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let body: signUpCredentials = req.body;

        const { isValid, errors } = signupValidate(body);
        if (!isValid) {
            return next(new ErrorReponse('Validate Error', 400, errors));
        }

        const dupRef = await users.where('email', '==', body.email).get();
        if (!dupRef.empty) return next(new ErrorReponse('email existing', 400));

        const uid = uuidGen('users');
        const password = await hashPassword(body.password);
        const detail: userInterface = {
            user_id: uid,
            name: body.name,
            email: body.email,
            password: password,
            createDate: FieldValue.serverTimestamp(),
            updateDate: FieldValue.serverTimestamp()
        };

        try {
            const userRef = await users.doc(uid).set(detail);
        } catch (error) {
            return new ErrorReponse('Internal server error', 500);
        }

        res.status(200).json({
            messsage: 'success'
        });
    }
);

// signin...
export const signIn = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const body: signInCredentials = req.body;

        const { isValid, errors } = singInValidate(body);
        if (!isValid) {
            return next(new ErrorReponse('Validate Error', 400, errors));
        }

        const userRef = await users
            .where('email', '==', body.email)
            .limit(1)
            .get();
        if (userRef.empty)
            return next(new ErrorReponse('email or passwrd is worng', 400));

        const user = userRef.docs[0].data();
        const compare = await comparePassword(body.password, user.password);
        if (!compare)
            return next(new ErrorReponse('email or passwrd is worng', 400));

        const detail: jwtClaims = {
            email: user.email,
            name: user.name,
            user_id: user.user_id
        };

        const token = jwtGenerate(detail);
        if (!token) return next(new ErrorReponse('Internal server error', 500));

        res.status(200).json({
            message: 'success',
            data: {
                token
            }
        });
    }
);

// hash password...
const hashPassword = async (password: string): Promise<string> => {
    const salt: string = await bcrypt.genSalt(16);
    return await bcrypt.hash(password, salt);
};

// compare pasword....
const comparePassword = async (
    password: string,
    hashPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
};
