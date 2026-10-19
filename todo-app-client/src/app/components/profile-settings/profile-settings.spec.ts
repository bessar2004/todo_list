import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { ProfileSettings } from './profile-settings';
import { AuthService, CurrentUser } from '../../services/auth';
import { authInterceptor } from '../../interceptors/auth-interceptor';
import { environment } from '../../../environments/environment';

describe('ProfileSettings', () => {
  const account: CurrentUser = { userId: 'test-user', fullName: 'Test User', email: 'test@example.com' };
  const passwordDetails = { currentPassword: 'old test passphrase', newPassword: 'new test passphrase', confirmPassword: 'new test passphrase' };
  const meUrl = `${environment.apiUrl}/me`;
  let fixture: ComponentFixture<ProfileSettings>;
  let component: ProfileSettings;
  let http: HttpTestingController;
  let auth: AuthService;
  let savedSession: string | null;
  let savedLocal: string | null;

  beforeEach(async () => {
    savedSession = sessionStorage.getItem('accessToken');
    savedLocal = localStorage.getItem('accessToken');
    sessionStorage.setItem('accessToken', 'test-token');
    localStorage.removeItem('accessToken');
    await TestBed.configureTestingModule({
      imports: [ProfileSettings],
      providers: [provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()]
    }).compileComponents();
    auth = TestBed.inject(AuthService);
    auth.currentUser.set({ ...account });
    http = TestBed.inject(HttpTestingController);
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(ProfileSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
    for (const [storage, value] of [[sessionStorage, savedSession], [localStorage, savedLocal]] as const) {
      if (value === null) storage.removeItem('accessToken');
      else storage.setItem('accessToken', value);
    }
  });

  it('loads the profile and renders email read-only', () => {
    expect(component.profileForm.controls.fullName.value).toBe(account.fullName);
    const email = fixture.nativeElement.querySelector('#profile-email') as HTMLInputElement;
    expect(email.readOnly).toBe(true);
    expect(email.value).toBe(account.email);
  });

  it('fills late account data without overwriting a dirty name draft', () => {
    auth.currentUser.set(null);
    fixture.detectChanges();
    auth.currentUser.set({ ...account, fullName: 'Loaded Name' });
    fixture.detectChanges();
    expect(component.profileForm.controls.fullName.value).toBe('Loaded Name');
    component.profileForm.controls.fullName.setValue('Draft Name');
    component.profileForm.markAsDirty();
    auth.currentUser.set({ ...account, fullName: 'Loaded Name' });
    fixture.detectChanges();
    expect(component.profileForm.controls.fullName.value).toBe('Draft Name');
  });

  it('saves only the trimmed name with authorization and updates shared profile state', () => {
    component.profileForm.controls.fullName.setValue('  Updated Name  ');
    component.saveProfile();
    component.saveProfile();
    const request = http.expectOne(meUrl);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ fullName: 'Updated Name' });
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush({ ...account, fullName: 'Updated Name' });
    fixture.detectChanges();
    expect(auth.currentUser()?.fullName).toBe('Updated Name');
    expect(auth.avatarInitial()).toBe('U');
    expect(component.profileSaved()).toBe(true);
    expect(component.savingProfile()).toBe(false);
    expect(component.profileForm.pristine).toBe(true);
  });

  it('rejects blank, too-long and unchanged names without a request', () => {
    for (const value of ['', '   ', 'x'.repeat(101), account.fullName]) {
      component.profileForm.controls.fullName.setValue(value);
      component.saveProfile();
      http.expectNone(meUrl);
    }
  });

  it('keeps the saved profile intact on failure and allows retry', () => {
    component.profileForm.controls.fullName.setValue('New Name');
    component.saveProfile();
    http.expectOne(meUrl).flush({}, { status: 500, statusText: 'Server error' });
    expect(component.profileError()).toBe('profile.saveError');
    expect(component.savingProfile()).toBe(false);
    expect(auth.currentUser()?.fullName).toBe(account.fullName);
    component.saveProfile();
    http.expectOne(meUrl).flush({ ...account, fullName: 'New Name' });
    expect(component.profileSaved()).toBe(true);
  });

  it('rejects missing current password, short new password and mismatch before sending', () => {
    for (const details of [
      { ...passwordDetails, currentPassword: '' },
      { ...passwordDetails, newPassword: 'short', confirmPassword: 'short' },
      { ...passwordDetails, confirmPassword: 'different' }
    ]) {
      component.passwordForm.setValue(details);
      component.changePassword();
      expect(component.passwordForm.invalid).toBe(true);
      http.expectNone(`${meUrl}/change-password`);
    }
  });

  it('changes the password once, clears sensitive fields and logs out for a new login', () => {
    component.passwordForm.setValue(passwordDetails);
    component.changePassword();
    component.changePassword();
    const request = http.expectOne(`${meUrl}/change-password`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(request.request.body).toEqual(passwordDetails);
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(auth.currentUser()).toBeNull();
    expect(auth.getAccessToken()).toBeNull();
    expect(Object.values(component.passwordForm.getRawValue())).toEqual(['', '', '']);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/login'], { queryParams: { passwordChanged: 'true' }, replaceUrl: true });
  });

  it.each([
    [400, { errors: { PasswordMismatch: ['Incorrect password.'] } }, 'profile.wrongPassword'],
    [429, null, 'profile.tooManyAttempts'],
    [500, {}, 'profile.passwordError']
  ])('handles password failure %s without logging out', (status, body, errorKey) => {
    component.passwordForm.setValue(passwordDetails);
    component.changePassword();
    http.expectOne(`${meUrl}/change-password`).flush(body, { status, statusText: 'Error' });
    expect(component.passwordError()).toBe(errorKey);
    expect(component.savingPassword()).toBe(false);
    expect(auth.getAccessToken()).toBe('test-token');
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  });

  it('does not overwrite another session with a late profile response', () => {
    component.profileForm.controls.fullName.setValue('Old Session Name');
    component.saveProfile();
    sessionStorage.setItem('accessToken', 'new-token');
    http.expectOne(meUrl).flush({ ...account, fullName: 'Old Session Name' });
    expect(auth.currentUser()?.fullName).toBe(account.fullName);
  });

  it('does not log out another session after a late password response', () => {
    component.passwordForm.setValue(passwordDetails);
    component.changePassword();
    sessionStorage.setItem('accessToken', 'new-token');
    http.expectOne(`${meUrl}/change-password`).flush(null, { status: 204, statusText: 'No Content' });
    expect(auth.getAccessToken()).toBe('new-token');
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  });

  it('translates the account forms in TR, EN and AR', () => {
    const originalLanguage = component.language.currentLanguage();
    try {
      for (const [language, title, direction] of [['tr', 'Şifre değiştir', 'ltr'], ['en', 'Change password', 'ltr'], ['ar', 'تغيير كلمة المرور', 'rtl']] as const) {
        component.language.setLanguage(language);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#password-heading').textContent).toContain(title);
        expect(fixture.nativeElement.textContent).not.toContain('profile.');
        expect(document.documentElement.dir).toBe(direction);
      }
    } finally { component.language.setLanguage(originalLanguage); }
  });

  it('cancels in-flight work when leaving the settings page', () => {
    component.profileForm.controls.fullName.setValue('New Name');
    component.saveProfile();
    const request = http.expectOne(meUrl);
    fixture.destroy();
    expect(request.cancelled).toBe(true);
  });
});
