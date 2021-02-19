import { DatePipe, Time } from "@angular/common";
import { TimeSpan } from "./users/timespan";

export interface Reservation {
    id: number;
    userId: number;
    roomId: number;
    startDate: Date;
    endDate: Date;
    arrivalTime: TimeSpan;
    parking: boolean;
    massage: boolean;
    extraTowels: boolean;
}