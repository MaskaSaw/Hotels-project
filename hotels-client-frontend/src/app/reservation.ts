import { ReservationService } from "./reservation-service";

export class Reservation {
    id: number;
    userId: number;
    roomId: number;
    startDate: Date;
    endDate: Date;
    arrivalTime: string;
    departureTime: string;
    reservationServices: ReservationService[];


    constructor() {
        this.id = 0;
        this.userId = 0;
        this.roomId = 0;
        this.startDate = new Date();
        this.endDate = new Date();
        this.arrivalTime = '00:00';
        this.departureTime = '00:00';
        this.reservationServices = [];
    }
}