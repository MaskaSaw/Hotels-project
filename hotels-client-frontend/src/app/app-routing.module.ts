import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelDetailedComponent } from './hotel-detailed/hotel-detailed.component';
import { HotelsComponent } from './hotels/hotels.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full'},
  { path: 'hotels', component: HotelsComponent },
  { path: 'detailed/hotel/:id', component: HotelDetailedComponent },
  { path: 'detailed/room/:id', component: RoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
