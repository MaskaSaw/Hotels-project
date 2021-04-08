import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { Hotel } from '../hotel';
import { Params } from '../params';
import { SearchResult } from '../searchParams';
import { HotelsService } from './hotels.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class HotelsComponent implements OnInit {

  searchCtrl = new FormControl();
  filteredSearch:  Observable<SearchResult[]>;
  hotels: Hotel[] = [];
  params: Params = new Params;
  startMinDate = new Date();
  endMinDate = new Date();
  searchString: string = '';
  searchItem: SearchResult = new SearchResult();
  searchResults: SearchResult[] = []; 
  searchTermChanged: Subject<string> = new Subject<string>();

  constructor(
    private hotelsService: HotelsService,
    private router: Router,
  ) { 
    this.filteredSearch = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(searchResult => searchResult ? this.filterSearch(searchResult) : this.searchResults.slice())
      );
  }

  private filterSearch(value: string): SearchResult[] {
    const filterValue = value.toLowerCase();

    return this.searchResults.filter(searchResult => searchResult.filterData.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
    this.getHotels();
    this.params = new Params;
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.params.checkOut = this.endMinDate;
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels =>  this.hotels = hotels);
  }

  getSearchData(event?: any): void {
    if (this.searchTermChanged.observers.length === 0) {
      this.searchTermChanged.pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
          this.hotelsService.getSearch(this.searchString)
            .subscribe(searchResults => this.searchResults = searchResults);
          this.searchItem.type = 'Empty'
        })
    }
    this.searchTermChanged.next(event) 
  }

  clearFilter(): void {
    this.params = new Params();
    this.searchItem = new SearchResult;
    this.searchString = '';
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

    return true;
  }

  filterHotels(): void {
    this.chooseSearchParams();
    this.hotelsService.getHotels(this.params)
      .subscribe( hotels => this.hotels = hotels);
  }

  chooseSearchParams(): void {
    switch(this.searchItem.type) {
      case ('Empty'): {
        this.params.hotelName = this.searchString;
        this.params.city = this.searchString;
        this.params.country = this.searchString;
        this.params.globalSearch = true;
        break;
      }
      case ('Hotel'): {
        this.params.hotelName = this.searchItem.filterData;
        this.params.city = '';
        this.params.country = '';
        this.params.globalSearch = false;
        break;
      }
      case ('City'): {
        this.params.hotelName = '';
        this.params.city = this.searchItem.filterData;
        this.params.country = this.searchItem.additionalFilterData;
        this.params.globalSearch = false;
        break;
      }
      case ('Country'): {
        this.params.hotelName = '';
        this.params.city = '';
        this.params.country = this.searchItem.filterData;
        this.params.globalSearch = false;
      }
    }
  }

  onSelect(item: SearchResult): void {
    this.searchItem = item;
  }

}
