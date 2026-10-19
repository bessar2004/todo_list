import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../services/auth';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the signed-in user instead of sample profile data', () => {
    TestBed.inject(AuthService).currentUser.set({
      userId: 'user-1',
      fullName: 'Bessar Example',
      email: 'bessar@example.com'
    });
    fixture.detectChanges();

    const sidebar = fixture.nativeElement as HTMLElement;
    expect(sidebar.querySelector('.user-avatar')?.textContent?.trim()).toBe('B');
    expect(sidebar.querySelector('.user-info strong')?.textContent?.trim()).toBe('Bessar Example');
    expect(sidebar.querySelector('.user-info span')?.textContent?.trim()).toBe('bessar@example.com');
  });
});
