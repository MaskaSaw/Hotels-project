import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, forwardRef, Input } from '@angular/core';
 
 
@Directive({
  selector: '[dateValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: DateValidatorDirective, multi: true }
  ]
})
export class DateValidatorDirective implements Validator {

  @Input("secondDate") secondDate: Date = new Date();
  @Input("dateType") dateType: string = '';
 
  validate(control: FormControl) {
    
    const value = new Date(control.value);
    
    if (value !== null) {
      if (this.dateType === 'startDate') {
        if (value > this.secondDate) {
          return { 'wrongDate': true };
        }
  
        return null;
      } 
      else if (this.dateType === 'endDate') {
        if (value < this.secondDate) {
          return { 'wrongDate': true };
        }

        return null;
      }
    }
    
    return null;
  }
}