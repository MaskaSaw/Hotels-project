import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HotelsComponent } from './hotels/hotels.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { UsersComponent } from './users/users.component';
import { MessagesComponent } from './messages/messages.component';
import { TimeFormatPipe } from './pipes';
import { AuthGuard } from './auth.guard';
import { NameValidatorDirective } from './Validators/name.validator';
import { LocationValidatorDirective } from './Validators/location.validator';
import { DigitValidatorDirective } from './Validators/digit.validator';
import { PasswordValidatorDirective } from './Validators/password.validator';
import { DateValidatorDirective } from './Validators/date.validator';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HotelsComponent,
    RoomsComponent,
    ReservationsComponent,
    UsersComponent,
    MessagesComponent,
    TimeFormatPipe,
    NameValidatorDirective,
    LocationValidatorDirective,
    DigitValidatorDirective,
    PasswordValidatorDirective,
    DateValidatorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
