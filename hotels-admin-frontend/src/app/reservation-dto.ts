import { ReservationService } from "./reservationService";

export class ReservationDTO {
  id: number;
  roomId: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  arrivalTime: string;
  departureTime: string;
  country: string;
  city: string;
  cost: number;
  hotelName: string;
  roomNumber: string;
  userName: string;
  reservationServices: ReservationService[];


  constructor() {
      this.id = 0;
      this.roomId = 0;
      this.userId = 0;
      this.startDate = new Date();
      this.endDate = new Date();
      this.arrivalTime = '00:00';
      this.departureTime = '00:00';
      this.country = '';
      this.city = '';
      this.cost = 0;
      this.hotelName = '';
      this.roomNumber = '';
      this.userName = '';
      this.reservationServices = [];
  }
}