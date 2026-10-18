import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  // E-posta alanı ve doğrulama kuralları.
  readonly forgotForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  // API isteği sırasında düğmeyi yönetmek için.
  readonly isSubmitting = signal(false);

  // API'den gelebilecek genel hata mesajının çeviri anahtarı.
  readonly requestError = signal<string | null>(null);
  readonly requestSucceeded = signal(false);

  constructor(
    public readonly language: LanguageService,
    private readonly auth: AuthService
  ) {}

  get emailControl(): FormControl<string> {
    return this.forgotForm.controls.email;
  }

  // Form gönderildiğinde çağrılan yöntem.
  onSubmit(): void {
    // Eğer zaten bir gönderim işlemi devam ediyorsa, yeni bir gönderim başlatma
    if (this.isSubmitting()) {
      return;
    }


    // Önceki hata mesajını temizle. Gönderim durumu API bağlandığında değişecek.
    this.requestError.set(null);
    this.requestSucceeded.set(false);
    // E-posta alanındaki boşlukları kaldırmak için.
    this.emailControl.setValue(this.emailControl.value.trim());

    // Form geçerliliğini kontrol et.
    if (this.forgotForm.invalid) {
      // Tüm alanları dokunulmuş olarak işaretle, böylece kullanıcı hangi alanların hatalı olduğunu görebilir.
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.auth.requestPasswordReset(
      this.emailControl.value,
      this.language.currentLanguage()
    ).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.requestSucceeded.set(true);
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.requestError.set(
          error instanceof HttpErrorResponse && error.status === 503
            ? 'auth.forgot.notConfigured'
            : 'auth.forgot.error'
        );
      }
    });
  }
}
