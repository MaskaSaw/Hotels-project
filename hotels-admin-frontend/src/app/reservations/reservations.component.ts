import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, Subscription } from 'rxjs';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { ReservationsService } from './reservations.service';
import { Reservation } from '../reservation';
import { AuthGuard } from '../auth.guard';
import { RoomsService } from '../rooms/rooms.service';
import { Service } from '../service';
import { ReservationService } from '../reservationService';
import { ReservationParams } from '../reservationsParams';
import { ReservationDTO } from '../reservation-dto';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { User } from '../user';
import { HotelsService } from '../hotels/hotels.service';
import { RoomSearch } from '../room-search';
import { Room } from '../room';
import * as moment from 'moment';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.less'],
  providers: [ AuthGuard ]
})
export class ReservationsComponent implements OnInit {

  reservations: ReservationDTO[] = [];
  services: Service[] = [];
  includedServices: boolean[] = [];
  reservation: Reservation;
  routePart: string = '';
  params: ReservationParams = new ReservationParams();
  id: number = 0;
  edit: boolean = false;
  editFormOn: boolean = false;
  users: User[] = [];
  userName: string = '';
  hotels: string[] = [];
  hotelName: string = '';
  roomCost: number = 0;
  rooms: RoomSearch[] = [];
  roomNumber: string = '';
  userSearchTermChanged: Subject<string> = new Subject<string>();
  hotelSearchTermChanged: Subject<string> = new Subject<string>();
  roomSearchTermChanged: Subject<string> = new Subject<string>();

  private routeSubscription: Subscription;
  constructor(
      private reservationsService: ReservationsService,
      private roomsService: RoomsService,
      private usersService: UsersService,
      private hotelsService: HotelsService,
      private route: ActivatedRoute,
    ) { 
      this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
      this.reservation = new Reservation(); 
    }
  
  ngOnInit(): void { 
    this.getReservations();
    this.edit = false;
  }

  openEditForm(): void {
    this.editFormOn = true;
    for (let i = 0; i < this.services.length; i++) {
      this.includedServices.push(false);
    }
    if (this.isRoom()) {
      this.reservation.roomId = this.id;
    }
    else {
      this.reservation.userId = this.id;
    }
  }

  closeEditForm(): void {
    this.editFormOn = false;
    this.reservation = new Reservation();
    this.includedServices = [];
  }

  filterReservations(): void {
    this.getReservations();
  }

  clearFilters(): void {
    this.params = new ReservationParams();
    this.getReservations();
  }

  editMode(reservationId: number): void {
    this.reservation = this.transformReservation(reservationId);
    this.roomsService.getServices(this.reservation.roomId)
        .subscribe(services => { 
          this.services = services;
          for (let i = 0; i < this.services.length; i++) {
            if (this.reservation.reservationServices.find(service => service.name == this.services[i].name)) {
              this.includedServices.push(true);
            }
            else {
              this.includedServices.push(false);
            }
          } 
        }
      );
    this.edit = true;
    
    this.editFormOn = true;
    window.scroll(0,0);
  }

  getReservations(): void {
    if (this.isRoom()) {
      this.routePart = 'room';
      this.roomsService.getServices(this.id)
        .subscribe(services => this.services = services);
      this.roomsService.getRoomCost(this.reservation.roomId)
        .subscribe(roomCost => this.roomCost = roomCost);
    }
    else if (this.isUser()) {
      this.routePart = 'user';
    }
      this.reservationsService.getReservations(this.id, this.routePart, this.params)
        .subscribe(reservations => this.reservations = reservations
      );
  }

  addReservation(): void {
    this.includeServices();
    if (this.isRoom()) {
      this.reservation.userId = this.users.find(user => user.login === this.userName)!.id;
    }
    else {
      this.reservation.roomId = this.rooms.find(room => room.roomNumber === this.roomNumber)!.id
    }
    this.reservation.cost = this.computeCost;
    this.reservationsService.addReservation(this.reservation)
      .subscribe(reservation => {
        if (reservation !== undefined) {
          this.reservations.push(reservation);
        }
      });

    this.reservation = new Reservation();
    this.includedServices = [];
    this.closeEditForm()
  }

  updateReservation(): void {
    this.includeServices();
    if (this.isRoom()) {
      this.reservation.userId = this.users.find( user => (user.name + '' + user.surname) === this.userName)!.id;
    }
    this.reservationsService.updateReservation(this.reservation)
      .subscribe();
    this.cancelEdit();
  }

  includeServices(): void {
    this.reservation.reservationServices = [];
    this.services.forEach((service, i) => {
      if (this.includedServices[i]) {
        let newService = new ReservationService();
        newService.name = service.name;
        newService.cost = service.cost;
        this.reservation.reservationServices.push(newService);
      }
    })
  }

  deleteReservation(reservationId: number): void {
    this.reservations = this.reservations.filter(reservation => reservation.id !== reservationId);
    this.reservationsService.deleteReservation(reservationId).subscribe();  
  }

  cancelEdit(): void {
    this.editFormOn = false;
    this.reservation = new Reservation();
    this.includedServices = [];
    this.services = [];
    this.edit = false;
  }

  transformReservation(id: number): Reservation {
    var reservationDTO = this.reservations.find(reservation => reservation.id === id)!
    this.userName = reservationDTO.userName;
    return {
      id: reservationDTO.id,
      userId: reservationDTO.userId,
      roomId: reservationDTO.roomId,
      startDate: reservationDTO.startDate,
      endDate: reservationDTO.endDate,
      arrivalTime: reservationDTO.arrivalTime,
      departureTime: reservationDTO.departureTime,
      reservationServices: reservationDTO.reservationServices
    } as Reservation;
  }

  getUsersData(event: any): void {
    if (this.userSearchTermChanged.observers.length === 0) {
      this.userSearchTermChanged.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(() => {
          this.usersService.getUserNames(this.userName)
            .subscribe(users => this.users = users)
          })
    }
    this.userSearchTermChanged.next(event) 
  }

  getHotelsData(event: any): void {
    if (this.hotelSearchTermChanged.observers.length === 0) {
      this.hotelSearchTermChanged.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(() => {
          this.hotelsService.getHotelNames(this.hotelName)
            .subscribe(hotels => this.hotels = hotels);
        })
    }
    this.hotelSearchTermChanged.next(event) 
  }

  getRoomsData(event: any): void {
    if (this.roomSearchTermChanged.observers.length === 0) {
      this.roomSearchTermChanged.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(() => {
          this.roomsService.getRoomNumbers(this.roomNumber, this.hotelName)
            .subscribe(rooms => this.rooms = rooms);
          const room = this.rooms.find(room => room.roomNumber === this.roomNumber)
          if (room) {
            this.reservation.roomId = room!.id;
            this.roomsService.getServices(room!.id)
              .subscribe(services => {
                this.services = services;
                for (let i = 0; i < this.services.length; i++) {
                  if (this.reservation.reservationServices.find(service => service.name == this.services[i].name)) {
                    this.includedServices.push(true);
                  }
                  else {
                    this.includedServices.push(false);
                  }
                }
              }
            );
            this.roomsService.getRoomCost(room!.id)
              .subscribe(roomCost => this.roomCost = roomCost);
          }
          else {
            this.reservation.roomId = 0;
          }
        })
    }
    this.roomSearchTermChanged.next(event) 
  }

  onSelect(event: TypeaheadMatch): void {
    this.userName = event.item.login;
  }

  parseDate(event: any): Date | null{
    if (event.target.value) {
      return new Date(event.target.value);
    }
    
    return null;
  }

  public get computeCost(): number {
    if (this.reservation.roomId !== 0) {
      let summary = this.roomCost * this.getDatesDiff();
      this.includeServices();
      for (let i = 0; i < this.reservation.reservationServices.length; i++) {
        summary += this.reservation.reservationServices[i].cost; 
      }

      return summary;
    }
    
    return 0;
  }

  getDatesDiff(): number {
    const a = moment(this.reservation.endDate).startOf('day');
    const b = moment(this.reservation.startDate).startOf('day');
    return a.diff(b, 'days');
  }

  isRoom(): boolean {
    if (this.route.toString().includes('rooms')) {
      this.reservation.roomId = this.id;
      return true;
    }

    return false;
  }

  isUser(): boolean {
    if (this.route.toString().includes('users')) {
      this.reservation.userId = this.id;
      return true;
    }

    return false;
  } 
}
