import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HotelsComponent } from './hotels/hotels.component';
import { HotelDetailedComponent } from './hotel-detailed/hotel-detailed.component';
import { RoomComponent } from './room/room.component';
import { ReservationComponent } from './reservation/reservation.component';


@NgModule({
  declarations: [
    AppComponent,
    HotelsComponent,
    HotelDetailedComponent,
    RoomComponent,
    ReservationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
