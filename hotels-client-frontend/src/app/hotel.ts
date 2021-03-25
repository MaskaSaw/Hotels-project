import { Room } from "./room";
import { Service } from "./service";

export class Hotel {

    id: number;
    name: string;
    country: string;
    city: string;
    address: string;
    image: string;
    rooms: Room[];
    services: Service[];

    constructor() {
        this.id = 0;
        this.name = '';
        this.country = '';
        this.city = '';
        this.address = '';
        this.image = '';
        this.rooms = [];
        this.services = [];
    }

}