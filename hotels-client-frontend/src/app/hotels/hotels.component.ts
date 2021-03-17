import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hotel } from '../hotel';
import { Reservation } from '../reservation';
import { Room } from '../room';
import { Params } from '../params';
import { HotelsService } from './hotels.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.less']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[];
  params: Params;
  minDate = new Date(2021,1,1);

  constructor(
    private hotelsService: HotelsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getHotels();
    this.params = new Params;
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels => this.hotels = hotels);
  }

  openDetailed(hotelId: number): void {
    this.router.navigate([`/detailed/hotel/${hotelId}`]);
  }

  checkDates(): boolean {
    if (this.params.checkIn !== null && this.params.checkOut !== null) {
      if (!isNaN(this.params.checkIn) && !isNaN(this.params.checkOut)) {
        return true;
      }

      return false;
    }

    return false;
  }

  filterHotels(): void {
    this.hotelsService.getHotels(this.params)
      .subscribe( hotels => this.hotels = hotels)
  }

}
