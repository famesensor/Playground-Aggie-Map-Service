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
    create_by?: string;
    update_by: string;
    create_date: Date;
    update_date: Date;
}
