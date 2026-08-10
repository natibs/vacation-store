import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface PasswordRule {
  key: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: readonly PasswordRule[] = [
  { key: 'length', label: '8–10 characters', test: (v) => v.length >= 8 && v.length <= 10 },
  { key: 'uppercase', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'lowercase', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'digit', label: 'One number', test: (v) => /[0-9]/.test(v) },
];

export function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (!value) return null;

  const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(value)).map((rule) => rule.key);
  return failedRules.length ? { passwordComplexity: failedRules } : null;
}
