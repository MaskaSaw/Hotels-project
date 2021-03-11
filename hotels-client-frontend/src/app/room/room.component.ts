import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Room } from '../room';
import { RoomsService } from './rooms.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit {

  room: Room;
  id = +this.route.snapshot.paramMap.get('id');

  constructor(
    private roomsService: RoomsService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getRoom();
  }

  getRoom(): void {
    this.roomsService.getRoom(this.id)
      .subscribe(room => this.room = room);
  }

  goBack(): void {
    this.location.back();
  }

}
