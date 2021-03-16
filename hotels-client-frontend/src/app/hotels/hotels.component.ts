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

 /* filterHotels(): void {
    var filteredHotels = this.hotels.filter(this.filterHotelByDates.bind(this));

    if (this.country !== '') {
      filteredHotels = filteredHotels.filter(hotel => hotel.country === this.country);
    }

    if (this.city !== '') {
      filteredHotels = filteredHotels.filter(hotel => hotel.city === this.city);
    }

    this.hotels = filteredHotels;
  }

  filterHotelByDates(hotel: Hotel): boolean {
    return hotel.rooms.filter(this.filterRoomByDates.bind(this))
      .filter(room => room.vacantBeds >= this.numberOfResidents).length > 0;
  }

  filterRoomByDates(room: Room): boolean {
    if (room.reservations !== null) {
      return room.reservations.filter(this.filterReservationByDates.bind(this)).length > 0;
    }
    
    return true;
  }

  filterReservationByDates(reservation: Reservation): boolean {
    if (reservation.startDate <= this.checkIn && reservation.endDate > this.checkIn) {
      return false;
    }

    if (reservation.startDate > this.checkIn && reservation.startDate < this.checkOut) {
      return false;
    }

    return true
  }

  */

}
