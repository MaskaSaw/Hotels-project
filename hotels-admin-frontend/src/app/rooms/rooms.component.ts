import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Room } from '../room';
import { Reservation } from '../reservation';
import { ReservationsService } from '../reservations/reservations.service';
import { RoomsService} from './rooms.service';
import { ROOM } from '../mock-objects';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.less']
})
export class RoomsComponent implements OnInit {

  rooms: Room[];
  room: Room;
  id = +this.route.snapshot.paramMap.get('id');

  constructor(
    private roomsService: RoomsService,
    private reservationsService: ReservationsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.room = Object.assign({}, ROOM);
  }

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms(): void {
    this.room.hotelId = this.id;
    this.roomsService.getRooms(this.id)
      .subscribe(rooms => this.rooms = rooms);   
  }

  addRoom(): void {
    this.roomsService.addRoom(this.room)
      .subscribe(room => {
        if (room !== undefined) {
          this.rooms.push(room);
        }
      });    
    this.room = Object.assign({}, ROOM)
    this.room.hotelId = this.id
  }

  deleteRoom(roomId: number): void {
    this.rooms = this.rooms.filter(room => room.id !== roomId);
    this.roomsService.deleteRoom(roomId).subscribe();
  }

  openReservations(roomId: number): void {
    this.reservationsService.storeRoomReservations(this.rooms.find(room => room.id == roomId)?.reservations as Reservation[]);
    this.router.navigate([`/rooms/${roomId}/reservations`]);
  }
}
