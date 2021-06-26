import { admin } from '../configs/firebase.config';

export interface mapInterface {
    Id?: string;
    unit: string;
    polyName: string;
    locations: location[];
    x_max?: number;
    x_min?: number;
    y_man?: number;
    y_min?: number;
}

export interface location {
    lat: number;
    lng: number;
}

export interface plan {
    plan_id?: string;
    plan_name: string;
    address: string;
    location: location;
    unit?: string;
    soilUnit?: string;
    gwavUnit?: string;
    hidoUnit?: string;
    create_by?: string;
    update_by?: string;
    create_date?: admin.firestore.FieldValue;
    update_date?: admin.firestore.FieldValue;
}

export enum StatusUnit {
    Appropriate = 'ค่อนข้างเหมาะสม',
    Inappropriate = 'ปานกลาง',
    LessAppropriate = 'ไม่เหมาะสม',
    VeryAppropriate = 'เหมาะสม'
}
