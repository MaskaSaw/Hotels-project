import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Hotel } from '../hotel';
import { HotelsService } from '../hotels/hotels.service';
import { Room } from '../room';
import { RoomsService } from '../room/rooms.service';

@Component({
  selector: 'app-hotel-detailed',
  templateUrl: './hotel-detailed.component.html',
  styleUrls: ['./hotel-detailed.component.less']
})
export class HotelDetailedComponent implements OnInit {

  hotel: Hotel;
  rooms: Room[];
  id = +this.route.snapshot.paramMap.get('id');

  constructor(
    private hotelsService: HotelsService,
    private roomsService: RoomsService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHotel();
    this.getRooms();
  }

  getHotel(): void {
    this.hotelsService.getHotel(this.id)
      .subscribe(hotel => this.hotel = hotel);
  }

  getRooms(): void {
    this.roomsService.getRooms(this.id)
      .subscribe(rooms => this.rooms = rooms)
  }

  openDetailed(roomId: number): void {
    this.router.navigate([`/detailed/room/${roomId}`]);
  }

  goBack(): void {
    this.location.back();
  }

}
