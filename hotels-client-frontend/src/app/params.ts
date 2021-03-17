export class Params {
  checkIn: Date;
  checkOut: Date;
  country: string;
  city: string;
  numberOfResidents: number;

  constructor() {
    this.checkIn = null;
    this.checkOut = null;
    this.country = '';
    this.city = '';
    this.numberOfResidents = 0;
  }
}