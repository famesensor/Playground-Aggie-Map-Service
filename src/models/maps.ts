export interface mapInterface {
    mapId?: string;
    unit: string;
    polyName: string;
    locations: location[];
}

export interface location {
    lat: number;
    lng: number;
}
