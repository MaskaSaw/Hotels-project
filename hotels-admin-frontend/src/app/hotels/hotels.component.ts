import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Hotel } from '../hotel';
import { HotelsService } from './hotels.service';
import { HOTEL } from '../initializer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.less']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[];
  hotel: Hotel;
  hotelFormData: FormData;
  imagesUrl = environment.resourceUrl;

  @ViewChild('imageUploader') imageUploader:ElementRef;

  constructor(
    private router: Router,
    private hotelsService: HotelsService,
  ) {
    this.hotel = Object.assign({}, HOTEL)
    this.hotelFormData = new FormData();
  }

  ngOnInit(): void {
    this.getHotels();
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels => this.hotels = hotels);
  }

  addHotel(): void {
    this.hotelFormData.append('hotelString', JSON.stringify(this.hotel));
    this.hotelsService.addHotel(this.hotelFormData)
      .subscribe(hotel => {
        if (hotel !== undefined) {
          this.hotels.push(hotel);
        }
      });    

    this.hotel = Object.assign({}, HOTEL);
    this.imageUploader.nativeElement.value = null;
  }

  deleteHotel(hotelId: number): void {
    this.hotels = this.hotels.filter(hotel => hotel.id !== hotelId);
    this.hotelsService.deleteHotel(hotelId).subscribe();
  }

  openRooms(hotelId: number): void {
    this.router.navigate([`hotels/${hotelId}/rooms`]);
  }

  onSelectFile(event: any) { 
    if (event.target.files && event.target.files[0]) {
      this.hotelFormData.append('image', event.target.files[0]);
    }   
  }

}
