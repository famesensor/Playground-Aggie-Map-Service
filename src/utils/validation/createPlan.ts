import validate from 'validator';
import { isEmpty } from './isEmpty';
import { plan } from '../../models/maps';
import { errorValidate } from '../../models/error';

export const createPlanValidate = (data: plan): errorValidate => {
    let errors: any = {};

    data.plan_name = !isEmpty(data.plan_name) ? data.plan_name : '';
    data.address = !isEmpty(data.address) ? data.address : '';
    data.location.lat = !isEmpty(data.location.lat) ? data.location.lat : 0;
    data.location.lng = !isEmpty(data.location.lng) ? data.location.lng : 0;

    if (validate.isEmpty(data.plan_name))
        errors.plan_name = `plan name is required`;
    if (validate.isEmpty(data.address)) errors.address = `address is required`;
    if (typeof data.location.lat !== 'number' && data.location.lat === 0)
        errors.lat = `latitude is required`;
    if (typeof data.location.lng !== 'number' && data.location.lng === 0)
        errors.lng = `longitude is required`;

    return {
        isValid: isEmpty(errors),
        errors: errors
    };
};
