import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hotel } from '../hotel';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  //TODO: create hotels.service and implement methods for receiving and transmitting data to the server
  hotels: Hotel[] = [
    { id: 0,
      name: "TestName",
      country: "TestCountry", 
      city: "TestCity", 
      address: "TestAddress", 
      parking: true, 
      massage: false, 
      extraTowels: true, 
      image: "No content"
    }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  openRooms(hotelId: number): void {
    this.router.navigate([`hotels/${hotelId}/rooms`]);
  }

}
