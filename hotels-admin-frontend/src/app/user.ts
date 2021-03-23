import { Reservation } from "./reservation";

export class User {
    id: number;
    login: string;
    password: string;
    role: string;
    reservations: Reservation[];

    constructor() {
        this.id = 0;
        this.login = '';
        this.password = '';
        this.role = 'User';
        this.reservations = [];
    }
}