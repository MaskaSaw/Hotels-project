import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, forwardRef, Input } from '@angular/core';
 
 
@Directive({
  selector: '[passwordValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }
  ]
})
export class PasswordValidatorDirective implements Validator {

  @Input("len") len: number = 0;
 
  validate(control: FormControl) {
    
    const value: string = control.value;
    
    if (value !== null) {
      if (value.length < 4 || value.length > 10) {
        return { 'length': true}
      }
    
      return null;
    }

    return null;
  }
}