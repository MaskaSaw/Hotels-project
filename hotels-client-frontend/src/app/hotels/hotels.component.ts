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
    private hotelsService: HotelsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getHotels();
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels => this.hotels = hotels);
  }

  openDetailed(hotelId: number): void {
    this.router.navigate([`/detailed/hotel/${hotelId}`]);
  }

}
