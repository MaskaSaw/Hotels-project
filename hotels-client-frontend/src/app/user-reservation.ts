import { ReservationService } from "./reservation-service";

export class UserReservation {
    id: number;
    roomId: number;
    userId: number;
    startDate: Date;
    endDate: Date;
    arrivalTime: string;
    departureTime: string;
    country: string;
    city: string;
    hotelName: string;
    roomNumber: string;
    reservationServices: ReservationService[];


    constructor() {
        this.id = 0;
        this.roomId = 0;
        this.userId = 0;
        this.startDate = new Date();
        this.endDate = new Date();
        this.arrivalTime = '00:00';
        this.departureTime = '00:00';
        this.country = '';
        this.city = '';
        this.hotelName = '';
        this.roomNumber = '';
        this.reservationServices = [];
    }
}