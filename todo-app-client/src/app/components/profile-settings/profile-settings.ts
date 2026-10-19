import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth';
import { LanguageService } from '../../services/language';

const nonBlank: ValidatorFn = control => control.value.trim() ? null : { required: true };
const passwordsMatch: ValidatorFn = form =>
  form.get('newPassword')?.value === form.get('confirmPassword')?.value
    ? null : { passwordMismatch: true };

@Component({
  selector: 'app-profile-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css'
})
export class ProfileSettings {
  readonly auth = inject(AuthService);
  readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private loadedUserId: string | null = null;

  readonly profileForm = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true, validators: [nonBlank, Validators.maxLength(100)]
    })
  });
  readonly passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', {
      nonNullable: true, validators: [Validators.required, Validators.minLength(15)]
    }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  }, { validators: passwordsMatch });

  readonly passwordFields = [
    { name: 'currentPassword', label: 'profile.currentPassword', autocomplete: 'current-password' },
    { name: 'newPassword', label: 'auth.reset.passwordLabel', autocomplete: 'new-password' },
    { name: 'confirmPassword', label: 'auth.reset.confirmLabel', autocomplete: 'new-password' }
  ] as const;

  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);
  readonly loadingProfile = signal(false);
  readonly busy = computed(() => this.savingProfile() || this.savingPassword() || this.loadingProfile());
  readonly profileSaved = signal(false);
  readonly profileError = signal<string | null>(null);
  readonly passwordError = signal<string | null>(null);
  readonly passwordsVisible = signal(false);

  constructor() {
    // Hesap bilgileri API'den sonradan gelse de form doldurulur; yazılan taslak korunur.
    effect(() => {
      const user = this.auth.currentUser();
      if (user && (user.userId !== this.loadedUserId || !this.profileForm.dirty)) {
        this.profileForm.reset({ fullName: user.fullName }, { emitEvent: false });
      }
      this.loadedUserId = user?.userId ?? null;
    });
    this.profileForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.profileSaved.set(false);
      this.profileError.set(null);
    });
  }

  saveProfile(): void {
    if (this.busy() || !this.auth.currentUser()) return;
    this.profileSaved.set(false);
    this.profileError.set(null);
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const fullName = this.profileForm.controls.fullName.value.trim();
    if (fullName === this.auth.currentUser()?.fullName) return;

    const token = this.auth.getAccessToken();
    this.savingProfile.set(true);
    this.auth.updateProfile(fullName).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.savingProfile.set(false))
    ).subscribe({
      next: user => {
        if (this.auth.getAccessToken() !== token) return;
        // Aynı sinyali okuyan yan menü ve avatar da anında güncellenir.
        this.auth.currentUser.set(user);
        this.profileForm.reset({ fullName: user.fullName });
        this.profileSaved.set(true);
      },
      error: () => this.profileError.set('profile.saveError')
    });
  }

  changePassword(): void {
    if (this.busy() || !this.auth.currentUser()) return;
    this.passwordError.set(null);
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const token = this.auth.getAccessToken();
    this.savingPassword.set(true);
    this.auth.changePassword(this.passwordForm.getRawValue()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.savingPassword.set(false))
    ).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.passwordsVisible.set(false);
        if (this.auth.getAccessToken() !== token) return;
        this.auth.logout();
        void this.router.navigate(['/login'], { queryParams: { passwordChanged: 'true' }, replaceUrl: true });
      },
      error: (error: HttpErrorResponse) => {
        const errors = error.error?.errors;
        this.passwordError.set(error.status === 429 ? 'profile.tooManyAttempts'
          : errors?.PasswordMismatch ? 'profile.wrongPassword'
          : errors?.PasswordTooShort ? 'auth.reset.passwordMinLength'
          : 'profile.passwordError');
      }
    });
  }

  passwordFieldError(name: keyof typeof this.passwordForm.controls): string | null {
    const control = this.passwordForm.controls[name];
    if (!control.touched) return null;
    if (control.hasError('required')) return 'auth.login.passwordRequired';
    if (control.hasError('minlength')) return 'auth.reset.passwordMinLength';
    if (name === 'confirmPassword' && this.passwordForm.hasError('passwordMismatch'))
      return 'auth.reset.passwordMismatch';
    return null;
  }

  reloadProfile(): void {
    if (this.busy()) return;
    const token = this.auth.getAccessToken();
    this.profileError.set(null);
    this.loadingProfile.set(true);
    this.auth.getCurrentUser().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingProfile.set(false))
    ).subscribe({
      next: user => { if (this.auth.getAccessToken() === token) this.auth.currentUser.set(user); },
      error: () => this.profileError.set('profile.loadError')
    });
  }
}
