import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router'; // 
import { provideHttpClient } from '@angular/common/http'; // 
import { provideHttpClientTesting } from '@angular/common/http/testing'; // 

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
   await TestBed.configureTestingModule({
  imports: [Login],
  providers: [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting()
  ]
}).compileComponents();
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('only requires a nonempty password when signing in', () => {
    component.loginForm.setValue({
      email: 'user@example.com',
      password: 'short',
      rememberMe: false
    });

    expect(component.loginForm.valid).toBe(true);
    component.passwordControl.setValue('');
    expect(component.passwordControl.hasError('required')).toBe(true);
  });
});
