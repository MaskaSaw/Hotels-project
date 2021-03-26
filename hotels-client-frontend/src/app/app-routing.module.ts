import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HotelDetailedComponent } from './hotel-detailed/hotel-detailed.component';
import { HotelsComponent } from './hotels/hotels.component';
import { ReservationComponent } from './reservation/reservation.component';
import { RoomComponent } from './room/room.component';
import { UserReservationsComponent } from './user-reservations/user-reservations.component';

const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full'},
  { path: 'hotels', component: HotelsComponent },
  { path: 'detailed/hotel/:id', component: HotelDetailedComponent },
  { path: 'detailed/room/:id', component: RoomComponent },
  { path: 'reservation/confirm', component: ReservationComponent, canActivate: [AuthGuard] },
  { path: 'user/reservations', component: UserReservationsComponent, canActivate: [AuthGuard] },
  { path: 'authentication', component: AuthenticationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
