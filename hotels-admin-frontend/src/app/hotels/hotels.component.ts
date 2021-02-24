import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Hotel } from '../hotel';
import { HotelsService } from './hotels.service';
import { HOTEL } from '../initializer';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.less']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[];
  hotel: Hotel;
  url: string;

  @ViewChild('imageUploader') imageUploader:ElementRef;

  constructor(
    private router: Router,
    private hotelsService: HotelsService,
  ) {
    this.hotel = Object.assign({}, HOTEL)
  }

  ngOnInit(): void {
    this.getHotels();
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels => this.hotels = hotels);
  }

  addHotel(): void {
    this.hotelsService.addHotel(this.hotel)
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

  onSelectFile(event: any) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.hotel.image = event.target.result;
        console.log(this.url);
      }  
    }   
  }

}
