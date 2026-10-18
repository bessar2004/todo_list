import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { Todo } from '../../models/todo.model';
import { SidebarStateService } from '../../services/sidebar-state';
import { TodoService } from '../../services/todo';
import { Calendar } from './calendar';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;
  let todos$: Subject<Todo[]>;

  beforeEach(async () => {
    todos$ = new Subject<Todo[]>();

    await TestBed.configureTestingModule({
      imports: [Calendar],
      providers: [
        { provide: TodoService, useValue: { getAll: () => todos$.asObservable() } },
        { provide: SidebarStateService, useValue: { toggle: () => {} } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows an error state when tasks cannot be loaded', async () => {
    expect(
      fixture.nativeElement.querySelector('.loading-state')
    ).not.toBeNull();

    todos$.error(
      new Error('API unavailable')
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isLoading()).toBe(false);
    expect(component.hasLoadError()).toBe(true);

    expect(
      fixture.nativeElement.querySelector('.error-state')
    ).not.toBeNull();

    expect(
      fixture.nativeElement.querySelector('.retry-button')
    ).not.toBeNull();

    const calendarContainer =
      fixture.nativeElement.querySelector('.calendar-container');

    expect(calendarContainer.hidden).toBe(true);
  });
});
