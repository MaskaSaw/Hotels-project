import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Room } from '../room';
import { Reservation } from '../reservation';
import { ReservationsService } from '../reservations/reservations.service';
import { RoomsService} from './rooms.service';
import { AuthService } from '../login/auth.service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.less'],
  providers: [ AuthGuard ]
})
export class RoomsComponent implements OnInit {

  rooms: Room[] = [];
  room: Room;
  id = +this.route.snapshot.paramMap.get('id')!;
  imageFormData: FormData;
  edit: boolean = false;
  editFormOn: boolean = false;
  imageToShow: string = '';

  @ViewChild('imageUploader') imageUploader!:ElementRef;

  constructor(
    private roomsService: RoomsService,
    private reservationsService: ReservationsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
     
  ) {
    this.room = new Room();
    this.imageFormData = new FormData();
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
    if (this.imageUploader.nativeElement.value) {
      this.roomsService.addImage(this.imageFormData)
        .subscribe(imageUrl => {
          this.room.image = imageUrl;
          this.roomsService.addRoom(this.room)
            .subscribe(room => {
              if (room !== undefined) {
                this.rooms.push(room);
              }
              this.closeEditForm();
              this.room = new Room();
              this.room.hotelId = this.id;
              this.imageUploader.nativeElement.value = null;
            }
          );      
        }
      );    
    }
    else {
      this.roomsService.addRoom(this.room)
        .subscribe(room => {
          if (room !== undefined) {
            this.rooms.push(room);
          }
          this.closeEditForm();
          this.room = new Room();
          this.room.hotelId = this.id;
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
    this.room = new Room();
    this.imageToShow = '';
    this.imageUploader.nativeElement.value = null;
  }

  editMode(roomId: number): void {
    this.room = this.rooms.find(room => room.id === roomId)!;
    this.imageToShow = this.room.image;
    this.edit = true;
    this.editFormOn = true;
    window.scroll(0,0);
  }

  updateRoom(): void {
    if (this.imageUploader.nativeElement.value) {
      this.roomsService.addImage(this.imageFormData)
        .subscribe(imageUrl => {
          this.room.image = imageUrl;
          this.roomsService.updateRoom(this.room)
            .subscribe(); 
          this.cancelEdit();     
        }
      ); 
    }
    else {
      this.roomsService.updateRoom(this.room)
        .subscribe(); 
      this.cancelEdit();
    }
  }

  deleteRoom(roomId: number): void {
    this.rooms = this.rooms.filter(room => room.id !== roomId);
    this.roomsService.deleteRoom(roomId).subscribe();
  }

  cancelEdit(): void {
    this.editFormOn = false;
    this.room = new Room();
    this.imageToShow = "";
    this.edit = false;
    this.imageUploader.nativeElement.value = null;
  }

  openReservations(roomId: number): void {
    this.router.navigate([`/rooms/${roomId}/reservations`]);
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFormData.append('image', event.target.files[0]);

      let imageReader = new FileReader();
      imageReader.readAsDataURL(event.target.files[0]);
      imageReader.onloadend = () => {
        this.imageToShow = imageReader.result as string;
      }  
    }   
  }
}
