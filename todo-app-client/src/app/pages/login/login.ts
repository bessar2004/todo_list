import { Component,signal } from '@angular/core';
import{FormControl, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import {
  LanguageService
} from '../../services/language';

import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {


readonly loginForm = new FormGroup({
    email: new FormControl(
      '',
      {
        // email alanı için FormControl oluşturuldu ve gerekli validasyonlar eklendi.
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email
        ]
      }
    ),
// şifre alanı için FormControl oluşturuldu ve gerekli validasyonlar eklendi.
    password: new FormControl(
      '',
      {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }
    ),

    rememberMe: new FormControl(
      false,
      {
        nonNullable: true
      }
    )
  });


  // şifre alanının görünürlüğünü kontrol etmek için passwordVisible sinyali oluşturuldu. 
readonly passwordVisible = signal(false);

// form gonderliyor mu kontrolu icin isSubmitting sinyali olusturuldu.
  readonly isSubmitting = signal(false);

  // login hatası için sinyal oluşturuldu. Başlangıçta null olarak ayarlandı, yani hata yok.
  readonly loginError = signal<string | null>(
    null
  );

 constructor(
  public readonly language: LanguageService,
  private readonly auth: AuthService,
  private readonly router: Router,
  public readonly route: ActivatedRoute
) {}
// form alanlarına kolay erişim için getter metotları
  get emailControl(): FormControl<string> {
    return this.loginForm.controls.email;
  }

  // form alanlarına kolay erişim için getter metotları
  get passwordControl(): FormControl<string> {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(
      currentValue => !currentValue
    );
  }

  //  formun geçerliliğini kontrol etmek için yardımcı bir metot
onSubmit(): void {
  this.loginError.set(null);

  if (this.isSubmitting()) return;

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { email, password, rememberMe } = this.loginForm.getRawValue();
  // form verilerini al ve login işlemini başlat

  this.isSubmitting.set(true);

  this.auth.login({ email: email.trim(), password }).subscribe({
    next: ({ accessToken }) => {
      if (!accessToken) {
        this.loginError.set('auth.login.error');
        // Eğer accessToken yoksa, hata mesajını ayarla ve formun gönderilme durumunu false yap.
        this.isSubmitting.set(false);
        return;
      }

      // Eğer accessToken varsa, önce localStorage ve sessionStorage'dan eski token'ları kaldır.
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');

      // Eğer kullanıcı "Beni Hatırla" seçeneğini işaretlediyse, token'ı localStorage'a kaydet, aksi halde sessionStorage'a kaydet.
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', accessToken);

      // Token'ı kaydettikten sonra, formun gönderilme durumunu false yap ve kullanıcıyı /tasks sayfasına yönlendir.
      this.isSubmitting.set(false);
      void this.router.navigateByUrl('/tasks');
    },
    error: () => {
      this.isSubmitting.set(false);
      this.loginError.set('auth.login.error');
    }
  });
}


}
