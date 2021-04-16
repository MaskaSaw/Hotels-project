import { Reservation } from "./reservation";

export class User {
    id: number;
    login: string;
    name: string;
    surname: string;
    password: string;
    role: string;
    reservations: Reservation[];

    constructor() {
        this.id = 0;
        this.login = '';
        this.name = '';
        this.surname = '';
        this.password = '';
        this.role = 'User';
        this.reservations = [];
    }
}