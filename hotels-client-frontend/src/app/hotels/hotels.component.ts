import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Hotel } from '../hotel';
import { Params } from '../params';
import { HotelsService } from './hotels.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  params: Params = new Params;
  minDate = new Date();
  countries: string[] = [];
  cities: string[] = [];

  constructor(
    private hotelsService: HotelsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getHotels();
    this.getSearchData();
    this.params = new Params;
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels =>  this.hotels = this.shuffle(hotels));
  }

  getSearchData(): void {
    this.hotelsService.getCountries()
      .subscribe(countries => this.countries = countries);
    this.hotelsService.getCities()
      .subscribe(cities => this.cities = cities);
  }

  clearFilter(): void {
    this.params = new Params();
    this.getHotels();
  }

  openDetailed(hotelId: number): void {
    this.router.navigate([`/detailed/hotel/${hotelId}`]);
  }

  checkParams(): boolean {
    if (isNaN(+this.params.checkIn) || isNaN(+this.params.checkOut)) {
      return false;
    }

    if (isNaN(+this.params.numberOfResidents) || this.params.numberOfResidents === '') {
      return false
    }

    return true;
  }

  shuffle(array: Hotel[]): Hotel[] {
    return array.sort(() => Math.random() -0.5);
  }

  filterHotels(): void {
    this.hotelsService.getHotels(this.params)
      .subscribe( hotels => this.hotels = hotels);
  }

}
