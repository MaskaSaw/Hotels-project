import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Room } from '../room';
import { Reservation } from '../reservation';
import { ReservationsService } from '../reservations/reservations.service';
import { RoomsService} from './rooms.service';
import { ROOM } from '../initializer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.less']
})
export class RoomsComponent implements OnInit {

  rooms: Room[];
  room: Room;
  id = +this.route.snapshot.paramMap.get('id');
  roomFormData: FormData;
  imagesUrl = environment.resourceUrl;

  @ViewChild('imageUploader') imageUploader:ElementRef;

  constructor(
    private roomsService: RoomsService,
    private reservationsService: ReservationsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.room = Object.assign({}, ROOM);
    this.roomFormData = new FormData();
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
    this.roomFormData.append('roomString', JSON.stringify(this.room));
    this.roomsService.addRoom(this.roomFormData)
      .subscribe(room => {
        if (room !== undefined) {
          this.rooms.push(room);
        }
      });    
    this.room = Object.assign({}, ROOM);
    this.room.hotelId = this.id;
    this.imageUploader.nativeElement.value = null;
  }

  deleteRoom(roomId: number): void {
    this.rooms = this.rooms.filter(room => room.id !== roomId);
    this.roomsService.deleteRoom(roomId).subscribe();
  }

  openReservations(roomId: number): void {
    this.reservationsService.storeRoomReservations(this.rooms.find(room => room.id == roomId)?.reservations as Reservation[]);
    this.router.navigate([`/rooms/${roomId}/reservations`]);
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.roomFormData.append('image', event.target.files[0]);
    }   
  }
}
