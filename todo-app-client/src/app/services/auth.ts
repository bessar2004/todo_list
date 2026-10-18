import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'; // 


// Angular tabanlı bir uygulamanın arka uç (backend) API'si ile iletişim 
// kurarak kullanıcı girişi işlemlerini yönettiği standart bir yetkilendirme 
// servisidir
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CurrentUser {
  userId: string;
  fullName: string;
  email: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable({ providedIn: 'root' })



export class AuthService {
  readonly currentUser = signal<CurrentUser | null>(null);
  private readonly loginUrl = `${environment.apiUrl}/auth/login`;
  private readonly registerUrl = `${environment.apiUrl}/auth/register`;
  private readonly forgotPasswordUrl = `${environment.apiUrl}/auth/forgot-password`;
  private readonly resetPasswordUrl = `${environment.apiUrl}/auth/reset-password`;
private readonly meUrl = `${environment.apiUrl}/me`;  // Kullanıcı bilgilerini almak için bir URL tanımlanır.
  constructor(private readonly http: HttpClient) {}

  // Kullanıcı girişi için bir HTTP POST isteği gönderir ve sunucudan gelen yanıtı döndürür.
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials);
  }

  getCurrentUser(): Observable<CurrentUser> {
  return this.http.get<CurrentUser>(this.meUrl);
}

// Kullanıcı kaydı için bir HTTP POST isteği gönderir ve sunucudan gelen yanıtı döndürür.
  register(details: RegisterRequest): Observable<void> {
  return this.http.post<void>(this.registerUrl, details);
}

  requestPasswordReset(email: string, language: 'tr' | 'en' | 'ar'): Observable<void> {
    return this.http.post<void>(this.forgotPasswordUrl, { email, language });
  }

  resetPassword(details: {
    userId: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<void> {
    return this.http.post<void>(this.resetPasswordUrl, details);
  }

// Kayıtlı erişim token’ını okur”

// Bu islem getirilen token ya kalici  hafizada  yada session hafizada token getirilir yada okunur
getAccessToken(): string | null {
  return sessionStorage.getItem('accessToken')
    ?? localStorage.getItem('accessToken');
}


// Tarayıcıda saklanan giriş token'ını temizler.
logout(): void {
  sessionStorage.removeItem('accessToken'); // SessionStorage'dan token'ı kaldırır. yani oturum kapatılır
  localStorage.removeItem('accessToken'); // LocalStorage'dan token'ı kaldırır. yani oturum kapatılır
  this.currentUser.set(null); // Kullanıcı bilgilerini sıfırlar.
}


}
