import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HotelsComponent } from './hotels/hotels.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ReservationsComponent } from './reservations/reservations.component'
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'hotels', component: HotelsComponent},
  { path: 'users', component: UsersComponent},
  { path: 'hotels/:id/rooms', component: RoomsComponent},
  { path: 'rooms/:id/reservations', component: ReservationsComponent},
  { path: 'users/:id/reservations', component: ReservationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
