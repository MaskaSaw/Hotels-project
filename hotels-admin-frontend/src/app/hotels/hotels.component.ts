import { Component, OnInit } from '@angular/core';
import { Hotel } from '../hotel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {

  hotels: Hotel[] = [
    { id: 0, name: "TestName", country: "TestCountry", city: "TestCity", address: "TestAddress", parking: true, massage: false, extraTowels: true, image: "No content"}]

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  openRooms(hotelId: number): void {
    this.router.navigate([`hotels/${hotelId}/rooms`]);
  }

}
