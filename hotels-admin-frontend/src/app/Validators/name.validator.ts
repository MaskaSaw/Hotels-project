import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, forwardRef, Input } from '@angular/core';
 
@Directive({
  selector: '[nameValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NameValidatorDirective, multi: true }
  ]
})
export class NameValidatorDirective implements Validator {

  @Input("len") len: string = '';
 
  validate(control: FormControl) {
    
    const value: string = control.value;
    const format = /[^\w\-/,. *S]/;
    
    if (value !== null) {
      if (value.length === 0 || value.length > +this.len) {
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