import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ReservationsService } from './reservations.service';
import { Reservation } from '../reservation';
import { AuthService } from '../login/auth.service';
import { AuthGuard } from '../auth.guard';
import { RoomsService } from '../rooms/rooms.service';
import { Service } from '../service';
import { ReservationService } from '../reservationService';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.less'],
  providers: [ AuthGuard ]
})
export class ReservationsComponent implements OnInit {

  reservations: Reservation[] = [];
  services: Service[] = [];
  includedServices: boolean[] = [];
  reservation: Reservation;
  routePart: string = '';
  id: number = 0;
  edit: boolean = false;
  editFormOn: boolean = false;

  private routeSubscription: Subscription;
  constructor(
      private reservationsService: ReservationsService,
      private roomsService: RoomsService,
      private route: ActivatedRoute,
    ) { 
      this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
      this.reservation = new Reservation(); 
    }
  
  ngOnInit(): void { 
    if (this.isRoom()) {
      this.routePart = 'room';
      this.roomsService.getServices(this.id)
        .subscribe(services => this.services = services);
    }
    else if (this.isUser()) {
      this.routePart = 'user';
    }
      this.reservationsService.getReservations(this.id, this.routePart)
        .subscribe(reservations => this.reservations = reservations
      );

    this.edit = false;
  }

  addReservation(): void {
    this.includeServices();
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

  openEditForm(): void {
    this.editFormOn = true;
    for (let i = 0; i < this.services.length; i++) {
      this.includedServices.push(false);
    }
  }

  closeEditForm(): void {
    this.editFormOn = false;
    this.reservation = new Reservation();
    this.includedServices = [];
  }

  editMode(reservationId: number): void {
    this.reservation = this.reservations.find(reservation => reservation.id === reservationId)!;
    this.edit = true;
    for (let i = 0; i < this.services.length; i++) {
      if (this.reservation.reservationServices.find(service => service.name == this.services[i].name)) {
        this.includedServices.push(true);
      }
      else {
        this.includedServices.push(false);
      }
    }
    this.editFormOn = true;
    window.scroll(0,0);
  }

  updateReservation(): void {
    this.includeServices();
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
    this.edit = false;
  }

  parseDate(dateString: string): Date | null{
    if (dateString) {
      return new Date(dateString);
    }
    
    return null;
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
