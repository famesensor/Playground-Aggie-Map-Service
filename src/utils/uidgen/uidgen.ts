import { v4 as uuidV4 } from 'uuid';

export const uuidGen = (prefix: string) => {
    return `${prefix}_${uuidV4()}`;
};
