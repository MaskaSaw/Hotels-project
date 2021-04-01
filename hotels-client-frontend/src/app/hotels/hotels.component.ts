import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  startMinDate = new Date();
  endMinDate = new Date();
  countries: string[] = [];
  cities: string[] = [];
  searchTermChanged: Subject<string> = new Subject<string>();

  constructor(
    private hotelsService: HotelsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getHotels();
    this.getCountriesData();
    this.params = new Params;
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.params.checkOut = this.endMinDate;
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels =>  this.hotels = hotels);
  }

  getCountriesData(): void {
    this.hotelsService.getCountries()
      .subscribe(countries => this.countries = countries);  
  }

  getCitiesData(event: any): void {
    if (this.searchTermChanged.observers.length === 0) {
      this.searchTermChanged.pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(() => {
          this.hotelsService.getCities(this.params.country, this.params.city)
            .subscribe(cities => this.cities = cities);
        })
    }
    this.searchTermChanged.next(event) 
  }

  clearFilter(): void {
    this.params = new Params();
    this.getHotels();
  }

  openDetailed(hotelId: number): void {
    this.hotelsService.saveDates(this.params.checkIn, this.params.checkOut);
    this.router.navigate([`/detailed/hotel/${hotelId}`]);
  }

  checkParams(): boolean {
    if (isNaN(+this.params.checkIn) || isNaN(+this.params.checkOut)) {
      return false;
    }

    if (isNaN(+this.params.numberOfResidents) || this.params.numberOfResidents === '') {
      return false
    }

    if (this.params.country === '') {
      return false;
    }

    return true;
  }

  filterHotels(): void {
    this.hotelsService.getHotels(this.params)
      .subscribe( hotels => this.hotels = hotels);
  }

}
