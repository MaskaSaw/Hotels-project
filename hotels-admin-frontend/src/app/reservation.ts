import { DatePipe } from "@angular/common";

export interface Reservation {
    id: number;
    userId: number;
    roomId: number;
    startDate: Date;
    endDate: Date;
    arrivalTime: Date;
    parking: boolean;
    massage: boolean;
    extraTowels: boolean;
}