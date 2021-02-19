import { DatePipe, Time } from "@angular/common";

export interface Reservation {
    id: number;
    userId: number;
    roomId: number;
    startDate: Date;
    endDate: Date;
    arrivalTime: Time;
    parking: boolean;
    massage: boolean;
    extraTowels: boolean;
}