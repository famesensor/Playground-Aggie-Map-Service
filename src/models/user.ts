import { admin } from '../configs/firebase.config';
export interface signUpCredentials {
    name: string;
    email: string;
    password: string;
}

export interface signInCredentials {
    email: string;
    password: string;
}

export interface userInterface {
    user_id: string;
    name: string;
    email: string;
    password: string;
    createDate: admin.firestore.FieldValue;
    updateDate: admin.firestore.FieldValue;
}

export interface jwtClaims {
    user_id: string;
    email: string;
    name: string;
}
