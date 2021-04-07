export class Params {
  checkIn: Date;
  checkOut: Date;
  hotelName: string;
  country: string;
  city: string;
  numberOfResidents: string;

  constructor() {
    this.checkIn = new Date();
    this.checkOut = new Date();
    this.checkOut.setDate(this.checkIn.getDate() + 1);
    this.hotelName = '';
    this.country = '';
    this.city = '';
    this.numberOfResidents = '';
  }
}