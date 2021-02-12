import { Reservation } from "./reservation";

export interface Room {
    id: number;
    roomType: string;
    vacantBeds: number;
    cost: number;
    available: boolean;
    reserved: boolean;
    image: string;
    roomNumber: string;
    hotelId: number;
    reservations: Reservation[];
}