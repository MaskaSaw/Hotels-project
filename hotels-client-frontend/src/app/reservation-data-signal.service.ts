import { Injectable } from '@angular/core';

import * as signalR from "@aspnet/signalr";

import { BehaviorSubject, Observable } from 'rxjs';

import { ReservationCreatedData } from './reservation-created-data';
import { environment } from '../environments/environment';
import { ApiPaths } from './api-paths';


@Injectable({
  providedIn: 'root'
})
export class ReservationDataSignalService {

  private hubConnection!: signalR.HubConnection;
  private dataObservable = new BehaviorSubject(new ReservationCreatedData());

  setValue(value: ReservationCreatedData) {
    this.dataObservable.next(value)
  }

  getValue(): Observable<ReservationCreatedData> {
    return this.dataObservable.asObservable();
  }

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.resourceUrl}${ApiPaths.Signal}`)
      .build();
    
      this.hubConnection
        .start()
        .catch(err => console.log('error with hub connection detected: ' + err))
  }

  public addTransferCreatedReservationDataListener(): void {
    this.hubConnection.on('transferCreatedReservationData', (data) => {
      this.setValue(data);
    });
  }
  

  constructor() { }
}
