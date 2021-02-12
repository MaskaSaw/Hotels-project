import { Reservation } from "./reservation";

export interface User {
    id: number;
    login: string;
    password: string;
    role: string;
    reservations: Reservation[];
}