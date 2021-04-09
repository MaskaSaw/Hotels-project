import { Injectable } from '@angular/core';

import * as signalR from "@aspnet/signalr";

import { BehaviorSubject, Observable } from 'rxjs';

import { ReservationCreatedData } from './reservation-created-data';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection!: signalR.HubConnection;
  private _dataObservable = new BehaviorSubject(new ReservationCreatedData());

  setValue(value: ReservationCreatedData) {
    this._dataObservable.next(value)
  }

  getValue(): Observable<ReservationCreatedData> {
    return this._dataObservable.asObservable();
  }

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44336/signal')
      .build();
    
      this.hubConnection
        .start()
        .then(() => console.log('connection started'))
        .catch(err => console.log('error with hub connection detected: ' + err))
  }

  public addTransferCreatedReservationDataListener(): void {
    this.hubConnection.on('transferCreatedReservationData', (data) => {
      this.setValue(data);
      console.log(data);
    });
  }
  

  constructor() { }
}
