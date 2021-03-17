import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hotel } from '../hotel';
import { Reservation } from '../reservation';
import { Room } from '../room';
import { HotelsService } from './hotels.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.less']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[];
  checkIn: Date;
  checkOut: Date;
  country: string;
  city: string;
  numberOfResidents: number;
  minDate = new Date(2021,1,1);

  constructor(
    private hotelsService: HotelsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getHotels();
    this.checkIn = null;
    this.checkOut = null;
    this.country = '';
    this.city = '';
    this.numberOfResidents = 0;
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels => this.hotels = hotels);
  }

  openDetailed(hotelId: number): void {
    this.router.navigate([`/detailed/hotel/${hotelId}`]);
  }

  checkDates(): boolean {
    if (this.checkIn !== null && this.checkOut !== null) {
      if (!isNaN(this.checkIn) && !isNaN(this.checkOut)) {
        return true;
      }

      return false;
    }

    return false;
  }

  filterHotels(): void {
    this.hotelsService.getHotels(this.country, this.city, this.numberOfResidents, this.checkIn, this.checkOut)
      .subscribe( hotels => this.hotels = hotels)
  }

}
