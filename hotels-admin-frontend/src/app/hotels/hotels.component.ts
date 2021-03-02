import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  hotel: Hotel;
  imageFormData: FormData;
  edit: boolean;
  imageToShow: string;

  @ViewChild('imageUploader') imageUploader:ElementRef;

  constructor(
    private router: Router,
    private hotelsService: HotelsService,
  ) {
    this.hotel = new Hotel();
    this.imageFormData = new FormData();
  }

  ngOnInit(): void {
    this.getHotels();
    this.edit = false;
    this.imageToShow = '';
  }

  getHotels(): void {
    this.hotelsService.getHotels()
      .subscribe(hotels => this.hotels = hotels);
  }

  addHotel(): void {
    if (this.imageUploader.nativeElement.value) {
      this.hotelsService.addImage(this.imageFormData)
        .subscribe(imageUrl => {
          this.hotel.image = imageUrl;
          this.hotelsService.addHotel(this.hotel)
            .subscribe(hotel => {
              if (hotel !== undefined) {
                this.hotels.push(hotel);
              }
            }
          );
        }
      )
    }
    this.hotelsService.addHotel(this.hotel)
      .subscribe(hotel => {
        if (hotel !== undefined) {
          this.hotels.push(hotel);
        }
      }
    );
    
    this.hotel = new Hotel();
    this.imageUploader.nativeElement.value = null;
  }

  editMode(hotelId: number): void {
    this.hotel = this.hotels.find(hotel => hotel.id === hotelId);
    this.imageToShow = this.hotel.image;
    this.edit = true;
    this.imageUploader.nativeElement.value = null;
  }

  updateHotel(): void {
    if (this.imageUploader.nativeElement.value) {
      this.hotelsService.addImage(this.imageFormData)
        .subscribe(imageUrl => {
          this.hotel.image = imageUrl;
          this.hotelsService.updateHotel(this.hotel)
            .subscribe();
        }
      );   
    }
    this.hotelsService.updateHotel(this.hotel)
      .subscribe();

    this.cancelEdit();  
  }

  deleteHotel(hotelId: number): void {
    this.hotels = this.hotels.filter(hotel => hotel.id !== hotelId);
    this.hotelsService.deleteHotel(hotelId).subscribe();
  }

  openRooms(hotelId: number): void {
    this.router.navigate([`hotels/${hotelId}/rooms`]);
  }

  cancelEdit(): void {
    this.hotel = new Hotel();
    this.imageToShow = "";
    this.edit = false;
    this.imageUploader.nativeElement.value = null;
  }

  onSelectFile(event: any) { 
    if (event.target.files && event.target.files[0]) {
      this.imageFormData.set('image', event.target.files[0]);

      let imageReader = new FileReader();
      imageReader.readAsDataURL(event.target.files[0]);
      imageReader.onloadend = () => {
        this.imageToShow = imageReader.result;
      }  
    }   
  }

}
