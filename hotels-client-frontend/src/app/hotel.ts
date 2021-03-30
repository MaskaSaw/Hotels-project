import { Room } from "./room";
import { Service } from "./service";

export class Hotel {

    id: number;
    name: string;
    country: string;
    city: string;
    address: string;
    image: string;
    roomCount: number;
    services: Service[];

    constructor() {
        this.id = 0;
        this.name = '';
        this.country = '';
        this.city = '';
        this.address = '';
        this.image = '';
        this.roomCount = 0;
        this.services = [];
    }

}