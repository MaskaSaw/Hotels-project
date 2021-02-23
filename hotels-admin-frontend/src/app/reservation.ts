
export interface Reservation {
    id: number;
    userId: number;
    roomId: number;
    startDate: Date;
    endDate: Date;
    arrivalTime: string;
    departureTime: string;
    parking: boolean;
    massage: boolean;
    extraTowels: boolean;
}