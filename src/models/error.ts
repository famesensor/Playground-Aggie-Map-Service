import { ErrorReponse } from '../utils/error/errorReponse';

export interface errorReponseExtended extends ErrorReponse {
    message: string | any;
    errors: any;
}
