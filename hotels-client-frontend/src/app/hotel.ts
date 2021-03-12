export class Hotel {

    id: number;
    name: string;
    country: string;
    city: string;
    address: string;
    parking: boolean;
    massage: boolean;
    extraTowels: boolean;
    image: string;

    constructor() {
        this.id = 0;
        this.name = '';
        this.country = '';
        this.city = '';
        this.address = '';
        this.parking = false;
        this.massage = false;
        this.extraTowels = false;
        this.image = '';
    }

}