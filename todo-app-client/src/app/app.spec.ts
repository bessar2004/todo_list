import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
// Bu dosya, Angular uygulamasının kök bileşeni olan App bileşenini test etmek için kullanılan birim testlerini içerir.
describe('App', () => {
  beforeEach(async () => {
    sessionStorage.setItem('accessToken', 'test-token');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    sessionStorage.removeItem('accessToken');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the todo board', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/tasks');
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne({ method: 'GET', url: 'http://localhost:5072/api/Todo' })
      .flush([]);

    TestBed.inject(HttpTestingController)
      .expectOne({ method: 'GET', url: 'http://localhost:5072/api/me' })
      .flush({
        userId: 'test-user',
        fullName: 'Test User',
        email: 'test@example.com'
      });


    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(compiled.querySelectorAll('.column-header h2'))
      .map((heading) => heading.textContent?.trim());
    expect(headings).toEqual(['Yapılacak', 'Devam Ediyor', 'Tamamlandı']);
    expect(compiled.querySelectorAll('.task-list').length).toBe(3);
  }, 15_000);

  it('should open the sidebar from the routed task page and close it from the overlay or sidebar', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/tasks');
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne({ method: 'GET', url: 'http://localhost:5072/api/Todo' })
      .flush([]);

    TestBed.inject(HttpTestingController)
      .expectOne({ method: 'GET', url: 'http://localhost:5072/api/me' })
      .flush({
        userId: 'test-user',
        fullName: 'Test User',
        email: 'test@example.com'
      });


    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const menu = element.querySelector<HTMLButtonElement>('.menu-button')!;
    expect(element.querySelector('.sidebar-overlay')).toBeNull();

    menu.click();
    fixture.detectChanges();
    expect(element.querySelector('.sidebar.mobile-open')).not.toBeNull();
    element.querySelector<HTMLElement>('.sidebar-overlay')!.click();
    fixture.detectChanges();
    expect(element.querySelector('.sidebar-overlay')).toBeNull();
    expect(element.querySelector('.sidebar.mobile-open')).toBeNull();

    menu.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('.mobile-close')!.click();
    fixture.detectChanges();
    expect(element.querySelector('.sidebar-overlay')).toBeNull();
    expect(element.querySelector('.sidebar.mobile-open')).toBeNull();
  }, 15_000);
});
