import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HotelsComponent } from './hotels/hotels.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ReservationsComponent } from './reservations/reservations.component'
import { UsersComponent } from './users/users.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'hotels', component: HotelsComponent, canActivate: [AuthGuard]},
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  { path: 'hotels/:id/rooms', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'rooms/:id/reservations', component: ReservationsComponent, canActivate: [AuthGuard]},
  { path: 'users/:id/reservations', component: ReservationsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
