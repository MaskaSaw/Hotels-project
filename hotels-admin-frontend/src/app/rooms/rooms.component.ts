import { Component, OnInit } from '@angular/core';
import { Room } from '../room'
import { Reservation } from '../reservation'
import { ReservationsService } from '../reservations.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [
    { id: 0, hotelId: 0, roomNumber: '0A', roomType: 'Standart', vacantBeds: 4, cost: 50.00, reserved: false, available: true, image: '', reservations: []}
  ];

  constructor(
    private reservationsService: ReservationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  openReservations(roomId: number): void {
    this.reservationsService.reservations = this.rooms.find(room => room.id == roomId)?.reservations as Reservation[];
    this.router.navigate([`/rooms/${roomId}/reservations`]);
  }
}