import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, forwardRef, Input } from '@angular/core';
 
@Directive({
  selector: '[alphaNumericValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: AlphaNumericValidatorDirective, multi: true }
  ]
})
export class AlphaNumericValidatorDirective implements Validator {

  @Input("len") len: number;
 
  validate(control: FormControl) {
    
    const value: string = control.value;
    const format = /[`!?@#$%^&*()_+\=\[\]{};':"\\|<>\/~]/;
    
    if (value !== null) {
      if (value.length === 0 || value.length > this.len) {
        return { 'length': true, 'maxLength': this.len }
      }
  
      if (format.test(value)) {
        return { 'format': true }
      }
   
      return null;
    }
    return null;
  }
}