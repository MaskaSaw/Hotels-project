import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Room } from '../room';
import { Reservation } from '../reservation';
import { ReservationsService } from '../reservations/reservations.service';
import { RoomsService} from './rooms.service';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.less']
})
export class RoomsComponent implements OnInit {

  rooms: Room[];
  room: Room;
  id = +this.route.snapshot.paramMap.get('id');
  imageFormData: FormData;
  edit: boolean;
  imageToShow: string;

  @ViewChild('imageUploader') imageUploader:ElementRef;

  constructor(
    private roomsService: RoomsService,
    private reservationsService: ReservationsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
     
  ) {
    if (this.authService.userLoggedIn) {
      this.room = new Room();
      this.imageFormData = new FormData();
    }
    else {
      this.authService.logout();
    } 
  }

  ngOnInit(): void {
    this.getRooms();
    this.edit = false;
    this.imageToShow = '';
  }

  getRooms(): void {
    this.room.hotelId = this.id;
    this.roomsService.getRooms(this.id)
      .subscribe(rooms => this.rooms = rooms);   
  }

  addRoom(): void {
    if (this.authService.userLoggedIn) {
      if (this.imageUploader.nativeElement.value) {
        this.roomsService.addImage(this.imageFormData)
          .subscribe(imageUrl => {
            this.room.image = imageUrl;
            this.roomsService.addRoom(this.room)
              .subscribe(room => {
                if (room !== undefined) {
                  this.rooms.push(room);
                }
              }
            );      
          }
        );    
      }
      this.roomsService.addRoom(this.room)
        .subscribe(room => {
          if (room !== undefined) {
            this.rooms.push(room);
          }
        }
      ); 
  
      this.room = new Room();
      this.room.hotelId = this.id;
      this.imageUploader.nativeElement.value = null;
    }
    else {
      this.authService.logout();
    }
  }

  editMode(roomId: number): void {
    this.room = this.rooms.find(room => room.id === roomId);
    this.imageToShow = this.room.image;
    this.edit = true;
  }

  updateRoom(): void {
    if (this.authService.userLoggedIn) {
      if (this.imageUploader.nativeElement.value) {
        this.roomsService.addImage(this.imageFormData)
          .subscribe(imageUrl => {
            this.room.image = imageUrl;
            this.roomsService.updateRoom(this.room)
              .subscribe();      
          }
        ); 
      }
      this.roomsService.updateRoom(this.room)
        .subscribe(); 
  
      this.cancelEdit();
    }
    else {
      this.authService.logout();
    }
  }

  deleteRoom(roomId: number): void {
    if (this.authService.userLoggedIn) {
      this.rooms = this.rooms.filter(room => room.id !== roomId);
      this.roomsService.deleteRoom(roomId).subscribe();
    }
    else {
      this.authService.logout();
    }  
  }

  cancelEdit(): void {
    this.room = new Room();
    this.imageToShow = "";
    this.edit = false;
    this.imageUploader.nativeElement.value = null;
  }

  openReservations(roomId: number): void {
    if (this.authService.userLoggedIn) {
      this.reservationsService.storeRoomReservations(
        this.rooms.find(room => room.id == roomId)?.reservations as Reservation[]
      );
      this.router.navigate([`/rooms/${roomId}/reservations`]);
    }
    else {
      this.authService.logout();
    }  
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFormData.append('image', event.target.files[0]);

      let imageReader = new FileReader();
      imageReader.readAsDataURL(event.target.files[0]);
      imageReader.onloadend = () => {
        this.imageToShow = imageReader.result;
      }  
    }   
  }
}
