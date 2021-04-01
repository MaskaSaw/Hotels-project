export class RoomBlock {
  id: number;
  end: Date;
  checkIn: Date;
  checkOut: Date;
  roomId: number;

  constructor() {
    this.id = 0;
    this.end = new Date();
    this.checkIn = new Date();
    this.checkOut = new Date();
    this.roomId = 0;
  }
}