import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { ResetPassword } from './reset-password';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ userId: 'user-1', token: 'reset-token' })
            }
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('rejects mismatched passwords without contacting the API', () => {
    component.resetForm.setValue({
      newPassword: '123456789012345',
      confirmPassword: 'different-password'
    });
    component.onSubmit();

    http.expectNone(req => req.url.endsWith('/auth/reset-password'));
    expect(component.resetForm.hasError('passwordMismatch')).toBe(true);
  });

  it('sends the token and new password to the API', () => {
    component.resetForm.setValue({
      newPassword: '123456789012345',
      confirmPassword: '123456789012345'
    });
    component.onSubmit();

    const request = http.expectOne(req => req.url.endsWith('/auth/reset-password'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      userId: 'user-1',
      token: 'reset-token',
      newPassword: '123456789012345',
      confirmPassword: '123456789012345'
    });
    request.flush(null, { status: 204, statusText: 'No Content' });

    expect(component.resetSucceeded()).toBe(true);
  });
});
