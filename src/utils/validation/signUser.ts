import validator from 'validator';
import { isEmpty } from './isEmpty';
import { signUpCredentials } from '../../models/user';
import { errorValidate } from '../../models/error';

export const signupValidate = (data: signUpCredentials): errorValidate => {
    let errors: any = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validator.isEmpty(data.name)) errors.name = `name is required`;
    if (validator.isEmpty(data.password))
        errors.password = `password is required`;
    if (validator.isEmpty(data.email)) errors.email = `email is required`;
    if (!validator.isEmail(data.email)) errors.email = `email is wrong`;

    return {
        isValid: isEmpty(errors),
        errors: errors
    };
};
