import validate from 'validator';
import { isEmpty } from './isEmpty';
import { signInCredentials } from '../../models/user';
import { errorValidate } from '../../models/error';

export const singInValidate = (data: signInCredentials): errorValidate => {
    let errors: any = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validate.isEmpty(data.email)) errors.email = `email is reqiured`;
    if (!validate.isEmail(data.email)) errors.email = `email is worng`;
    if (validate.isEmpty(data.password))
        errors.passowrd = `password is required`;

    return {
        isValid: isEmpty(errors),
        errors: errors
    };
};
