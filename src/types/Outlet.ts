export interface Coord {
    lat: number;
    lng: number;
}

export interface OutletType {
    id: number;
    name: string;
    address: string;
    distance: string;
    status: string;
    closeTime: string;
    phone: string;
    coords: Coord;
}