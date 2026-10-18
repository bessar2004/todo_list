import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { LanguageService } from '../../services/language';

// İki şifre alanının aynı olup olmadığını kontrol eder.
const passwordsMatchValidator: ValidatorFn = (form) => {
  // sifre ve şifre tekrarı alanlarının değerlerini alır.
  const password = form.get('password')?.value;
  // confirmPassword alanının değerini alır.
  const confirmPassword = form.get('confirmPassword')?.value;

  // Boş alanların hatasını kendi required doğrulayıcıları yönetir.
  if (!password || !confirmPassword) {
    return null;
  }

  // Şifreler eşleşiyorsa null döner, aksi halde passwordMismatch hatasını döner.
  return password === confirmPassword? null: { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  // Doğrulamada ve hata mesajlarında aynı sınırları kullanacağız.
  readonly nameMaxLength = 100;
  readonly passwordMinLength = 15;

  readonly registerForm = new FormGroup(
    {
      // Ad-soyad alanı için Angular'ın hazır required ve maxLength doğrulayıcılarını kullanıyoruz.
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(this.nameMaxLength)
        ]
      }),

      // E-posta alanı için Angular'ın hazır email doğrulayıcısını kullanıyoruz.
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email
        ]
      }),

      // Şifre alanı için Angular'ın hazır required ve minLength doğrulayıcılarını kullanıyoruz.
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(this.passwordMinLength)
        ]
      }),

      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      })
    },
    {
      // İki alanı karşılaştırdığı için kontrolü forma ekliyoruz.
      validators: passwordsMatchValidator
    }
  );

  readonly passwordVisible = signal(false);
  readonly confirmPasswordVisible = signal(false);

  readonly isSubmitting = signal(false);
  readonly registerError = signal<string | null>(null);

constructor(
  public readonly language: LanguageService,
  private readonly auth: AuthService,
  private readonly router: Router
) {}

  // HTML'den form alanlarına kısa yoldan erişim.
  get nameControl(): FormControl<string> {
    return this.registerForm.controls.fullName;
  }

  get emailControl(): FormControl<string> {
    return this.registerForm.controls.email;
  }

  get passwordControl(): FormControl<string> {
    return this.registerForm.controls.password;
  }

  get confirmPasswordControl(): FormControl<string> {
    return this.registerForm.controls.confirmPassword;
  }

  // İlk şifre alanının görünürlüğünü değiştirir.
  togglePasswordVisibility(): void {
    this.passwordVisible.update(value => !value);
  }

  // Şifre tekrarı alanının görünürlüğünü değiştirir.
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update(value => !value);
  }

  onSubmit(): void {
    // İleride API isteği sürerken ikinci isteği engelleyecek.
    if (this.isSubmitting()) {
      return;
    }

    // Hata mesajını temizler.
    this.registerError.set(null);

    // Ad-soyad ve e-postanın başındaki/sonundaki boşlukları temizler.
    this.registerForm.patchValue({
      fullName: this.nameControl.value.trim(),
      email: this.emailControl.value.trim()
    });

    // Form geçerli değilse tüm alanları dokunulmuş olarak işaretler ve geri döner.
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    

   this.isSubmitting.set(true);

this.auth.register(this.registerForm.getRawValue()).subscribe({
  next: () => {
    this.isSubmitting.set(false);
    void this.router.navigateByUrl('/login');
  },
  error: () => {
    this.isSubmitting.set(false);
    this.registerError.set('auth.register.error');
  }
});
  }
}