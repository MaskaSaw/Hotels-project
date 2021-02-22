import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment/moment';

@Pipe({
    name: 'timeFormatPipe',
})
export class TimeFormatPipe implements PipeTransform {
    transform(rawTime: string) {
        return moment(rawTime, 'hh:mm').format('LT');
    }
}