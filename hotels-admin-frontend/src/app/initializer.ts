import { Hotel } from './hotel';
import { Room } from './room';
import { Reservation } from './reservation';
import { User } from './user';

export const HOTEL: Hotel = {
    id: 0, 
    name: '',
    country: '',
    city: '',
    address: '',
    parking: false,
    massage: false,
    extraTowels: false,
    image: ''
}

export const ROOM: Room = {
    id: 0,
    roomType: '',
    vacantBeds: 0,
    cost: 0,
    available: false,
    reserved: false,
    image: '',
    roomNumber: '',
    hotelId: 0,
    reservations: [],
}

export const RESERVATION: Reservation = {
    id: 0,
    userId: 0,
    roomId: 0,
    startDate: new Date(),
    endDate: new Date(),
    arrivalTime: "00:00",
    departureTime: "00:00",
    parking: false,
    massage: false,
    extraTowels: false,
}

export const USER: User = {
    id: 0,
    login: '',
    password: '',
    role: 'User',
    reservations: []
}