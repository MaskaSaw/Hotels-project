import { Reservation } from "./reservation";

export class Room {
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

    constructor() {
        this.id = 0;
        this.hotelId = 0;
        this.roomType = 'Standart';
        this.roomNumber = '';
        this.vacantBeds = 0;
        this.cost = 0;
        this.available = false;
        this.reserved = false;
        this.image = '';
        this.reservations = [];
    }
}