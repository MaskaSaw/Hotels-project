import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Hotel } from '../hotel';
import { AuthService } from '../login/auth.service';
import { Params } from '../params';
import { Service } from '../service';
import { HotelsService } from './hotels.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.less']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  hotel: Hotel = new Hotel();
  params: Params = new Params();
  imageFormData: FormData = new FormData();
  edit: boolean = false;
  editFormOn: boolean = false;
  imageToShow: string = '';

  @ViewChild('imageUploader') imageUploader:ElementRef;

  constructor(
    private router: Router,
    private hotelsService: HotelsService,
    private authService: AuthService
  ) { }

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
              this.hotel = new Hotel();
              this.imageUploader.nativeElement.value = null;  
            }
          );
        }
      )
    }
    else {
      this.hotelsService.addHotel(this.hotel)
        .subscribe(hotel => {
          if (hotel !== undefined) {
            this.hotels.push(hotel);
          }
          this.hotel = new Hotel();
          this.imageUploader.nativeElement.value = null;  
        }
      );
    } 
  }

  openEditForm(): void {
    this.editFormOn = true;
  }

  closeEditForm(): void {
    this.editFormOn = false;
    this.hotel = new Hotel();
    this.imageToShow = "";
    this.imageUploader.nativeElement.value = null;
  }

  editMode(hotelId: number): void {
    this.editFormOn = true;
    this.hotel = this.hotels.find(hotel => hotel.id === hotelId)!;
    this.imageToShow = this.hotel.image;
    this.edit = true;
    this.imageUploader.nativeElement.value = null;
    window.scroll(0,0);
  }

  cancelEdit(): void {
    this.editFormOn = false;
    this.hotel = new Hotel();
    this.imageToShow = "";
    this.edit = false;
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
    else {
      this.hotelsService.updateHotel(this.hotel)
        .subscribe();
    }

    this.cancelEdit();  
  }

  deleteHotel(hotelId: number): void {
    this.hotels = this.hotels.filter(hotel => hotel.id !== hotelId);
    this.hotelsService.deleteHotel(hotelId).subscribe();
  }

  filterHotels(): void {
    this.hotelsService.getHotels(this.params)
      .subscribe(hotels => this.hotels = hotels);
  }

  clearFilters(): void {
    this.params = new Params();
    this.getHotels();
  }

  openRooms(hotelId: number): void {
    this.router.navigate([`hotels/${hotelId}/rooms`]);
  }

  addService() {
    this.hotel.services.push(new Service());
  }

  removeService(index: number) {
    this.hotel.services.splice(index, 1);
  }

  hotelsEmpty(): boolean {
    return this.hotels == [];
  }

  onSelectFile(event: any) { 
    if (event.target.files && event.target.files[0]) {
      this.imageFormData.set('image', event.target.files[0]);

      let imageReader = new FileReader();
      imageReader.readAsDataURL(event.target.files[0]);
      imageReader.onloadend = () => {
        this.imageToShow = imageReader.result as string;
      }  
    }   
  }

}
