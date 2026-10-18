import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';
import { LanguageService } from '../../services/language';

const passwordsMatch: ValidatorFn = form => {
  const password = form.get('newPassword')?.value;
  const confirmation = form.get('confirmPassword')?.value;
  return password && confirmation && password !== confirmation
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: '../forgot-password/forgot-password.css'
})
export class ResetPassword {
  readonly passwordMinLength = 15;
  readonly userId: string;
  readonly token: string;

  readonly resetForm = new FormGroup({
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(this.passwordMinLength)]
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  }, { validators: passwordsMatch });

  readonly isSubmitting = signal(false);
  readonly resetSucceeded = signal(false);
  readonly requestError = signal(false);

  constructor(
    public readonly language: LanguageService,
    private readonly auth: AuthService,
    route: ActivatedRoute
  ) {
    this.userId = route.snapshot.queryParamMap.get('userId') ?? '';
    this.token = route.snapshot.queryParamMap.get('token') ?? '';
  }

  get passwordControl(): FormControl<string> {
    return this.resetForm.controls.newPassword;
  }

  get confirmationControl(): FormControl<string> {
    return this.resetForm.controls.confirmPassword;
  }

  onSubmit(): void {
    if (this.isSubmitting() || this.resetSucceeded() || !this.userId || !this.token) {
      return;
    }

    this.requestError.set(false);
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.auth.resetPassword({
      userId: this.userId,
      token: this.token,
      ...this.resetForm.getRawValue()
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.resetSucceeded.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.requestError.set(true);
      }
    });
  }
}
