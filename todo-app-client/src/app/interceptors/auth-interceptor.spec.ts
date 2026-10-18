import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import { environment } from '../../environments/environment';
import { authInterceptor } from './auth-interceptor';

// HTTP responses and browser storage are simulated; no real account is used.
describe('authInterceptor', () => {
  const tasksUrl = `${environment.apiUrl}/Todo`;
  let http: HttpClient;
  let controller: HttpTestingController;
  let navigate: MockInstance<Router['navigate']>;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    controller.verify();
    vi.restoreAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it.each(['session', 'local'] as const)('sends the %s token and preserves a successful response', (storage) => {
    const tokenStorage = storage === 'session' ? sessionStorage : localStorage;
    tokenStorage.setItem('accessToken', 'test-token');
    const response = vi.fn();
    http.get(tasksUrl).subscribe(response);
    const request = controller.expectOne(tasksUrl);
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush([]);
    expect(response).toHaveBeenCalledWith([]);
    expect(tokenStorage.getItem('accessToken')).toBe('test-token');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('clears both tokens and requests login navigation on 401, preserving preferences', () => {
    sessionStorage.setItem('accessToken', 'invalid-session-token');
    localStorage.setItem('accessToken', 'old-local-token');
    localStorage.setItem('language', 'ar');
    const onError = vi.fn();
    http.get(tasksUrl).subscribe({ error: onError });
    const request = controller.expectOne(tasksUrl);
    expect(request.request.headers.get('Authorization')).toBe('Bearer invalid-session-token');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('language')).toBe('ar');
    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/login'], { replaceUrl: true });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    expect(onError.mock.calls[0][0]).toBeInstanceOf(HttpErrorResponse);
  });

  it('handles a protected request without a token and redirects on 401', () => {
    const onError = vi.fn();
    http.get(tasksUrl).subscribe({ error: onError });
    const request = controller.expectOne(tasksUrl);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/login'], { replaceUrl: true });
  });

  it.each([403, 500, 0])('preserves the session on error status %s', (status) => {
    sessionStorage.setItem('accessToken', 'test-token');
    const onError = vi.fn();
    http.get(tasksUrl).subscribe({ error: onError });
    const request = controller.expectOne(tasksUrl);
    if (status === 0) {
      request.error(new ProgressEvent('error'));
    } else {
      request.flush({}, { status, statusText: 'Test error' });
    }
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status }));
    expect(sessionStorage.getItem('accessToken')).toBe('test-token');
    expect(navigate).not.toHaveBeenCalled();
  });

  it.each([
    `${environment.apiUrl}/auth/login`,
    `${environment.apiUrl}/auth/register`,
    'https://example.test/data',
    `${environment.apiUrl}-other/Todo`
  ])('does not attach a token or log out for excluded URL %s', (url) => {
    sessionStorage.setItem('accessToken', 'test-token');
    const onError = vi.fn();
    http.post(url, {}).subscribe({ error: onError });
    const request = controller.expectOne(url);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    expect(sessionStorage.getItem('accessToken')).toBe('test-token');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('does not clear a new session when an older request returns 401', () => {
    sessionStorage.setItem('accessToken', 'old-token');
    const onError = vi.fn();
    http.get(tasksUrl).subscribe({ error: onError });
    const request = controller.expectOne(tasksUrl);
    expect(request.request.headers.get('Authorization')).toBe('Bearer old-token');
    sessionStorage.setItem('accessToken', 'new-token');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(sessionStorage.getItem('accessToken')).toBe('new-token');
    expect(navigate).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });
});
