export class Params {
  checkIn: Date;
  checkOut: Date;
  country: string;
  city: string;
  numberOfResidents: string;

  constructor() {
    this.checkIn = new Date();
    this.checkOut = new Date();
    this.country = '';
    this.city = '';
    this.numberOfResidents = '';
  }
}