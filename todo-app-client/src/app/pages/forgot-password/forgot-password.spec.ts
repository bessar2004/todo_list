import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router'; 
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ForgotPassword } from './forgot-password';

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let http: HttpTestingController;

  beforeEach(async () => {
await TestBed.configureTestingModule({
  imports: [ForgotPassword],
  providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not send an invalid email', () => {
    component.onSubmit();
    http.expectNone(request => request.url.endsWith('/auth/forgot-password'));
    expect(component.emailControl.touched).toBe(true);
  });

  it('sends a valid email and displays the generic success message', () => {
    component.emailControl.setValue('  user@example.com  ');
    component.onSubmit();

    const request = http.expectOne(req => req.url.endsWith('/auth/forgot-password'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'user@example.com', language: 'tr' });
    request.flush(null, { status: 202, statusText: 'Accepted' });

    expect(component.requestSucceeded()).toBe(true);
    expect(component.isSubmitting()).toBe(false);
  });

  it('explains when email delivery is not configured', () => {
    component.emailControl.setValue('user@example.com');
    component.onSubmit();

    http.expectOne(req => req.url.endsWith('/auth/forgot-password'))
      .flush(null, { status: 503, statusText: 'Service Unavailable' });

    expect(component.requestError()).toBe('auth.forgot.notConfigured');
  });
});
