import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, forwardRef, Input } from '@angular/core';

@Directive({
  selector: '[digitValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: DigitValidatorDirective, multi: true }
  ]
})
export class DigitValidatorDirective implements Validator {

  @Input("int") int: string = '';

  validate(control: FormControl) {
    
    const value: number = +control.value;
    const intFormat = /^(?:[1-9]\d*|\d)$/;
    const floatFormat = /^\s*-?\d+(\.\d{1,2})?\s*$/;
    
    if (value !== null) {
      if (value <= 0 || value > Number.MAX_VALUE) {
        return { 'range': true }
      }

      if (this.int === 'true') {
        if (!intFormat.test(control.value)) {
          return { 'nonDigitCharacters': true }
        }
      }
      else if (this.int === 'false') {
        if (!floatFormat.test(control.value)) {
          return { 'nonDigitCharacters': true }
        }
      }

      return null;
    }
    return null;
  }
}