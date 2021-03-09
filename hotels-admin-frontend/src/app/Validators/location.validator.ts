import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, forwardRef, Input } from '@angular/core';
 
 
@Directive({
  selector: '[locationValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: LocationValidatorDirective, multi: true }
  ]
})
export class LocationValidatorDirective implements Validator {

  @Input("len") len:number;
 
  validate(control: FormControl) {
    
    const value: string = control.value;
    const format = /[`!?№@#$%^&*()_+\=\[\]{};':"\\|,.<>\/~(1-9)]/;
    
    if (value !== null) {
      if (value.length === 0 || value.length > this.len) {
        return { 'length': true, 'maxLength': this.len}
      }
  
      if (format.test(value)) {
        return { 'specialCharacters': true }
      }
    
      return null;
    }
    return null;
  }
}