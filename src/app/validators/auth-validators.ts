import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Attach to a "confirm password" control; reads the named sibling control on its parent group. */
export function passwordsMatchValidator(passwordControlName = 'password'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get(passwordControlName)?.value;
    if (!password || !control.value || password === control.value) return null;
    return { passwordsMismatch: true };
  };
}

