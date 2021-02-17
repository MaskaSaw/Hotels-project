import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hotel } from '../hotel';
import { HotelsService } from './hotels.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.less']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[];

  constructor(
    private router: Router,
    private hotelsService: HotelsService
  ) { }

  ngOnInit(): void {
    this.getHotels();
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels => this.hotels = hotels);
  }

  deleteHotel(hotelId: number): void {
    this.hotels = this.hotels.filter(hotel => hotel.id !== hotelId);
    this.hotelsService.deleteHotel(hotelId).subscribe();
  }

  openRooms(hotelId: number): void {
    this.router.navigate([`hotels/${hotelId}/rooms`]);
  }

}
