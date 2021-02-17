import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Room } from '../room';
import { Reservation } from '../reservation';
import { ReservationsService } from '../reservations/reservations.service';
import { RoomsService} from './rooms.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.less']
})
export class RoomsComponent implements OnInit {

  rooms: Room[];

  constructor(
    private roomsService: RoomsService,
    private reservationsService: ReservationsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.roomsService.getRooms(id)
      .subscribe(rooms => this.rooms = rooms);   
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
