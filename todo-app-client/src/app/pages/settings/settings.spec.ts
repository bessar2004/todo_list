import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../../services/auth';
import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the current account in the profile preview', () => {
    TestBed.inject(AuthService).currentUser.set({
      userId: 'user-2',
      fullName: 'Ayşe Demir',
      email: 'ayse@example.com'
    });
    fixture.detectChanges();

    const settings = fixture.nativeElement as HTMLElement;
    expect(settings.querySelector('.profile-avatar')?.textContent?.trim()).toBe('A');
    expect(settings.querySelector('.profile-preview strong')?.textContent?.trim()).toBe('Ayşe Demir');
    expect(settings.querySelector('.profile-preview span')?.textContent?.trim()).toBe('ayse@example.com');
  });
});
