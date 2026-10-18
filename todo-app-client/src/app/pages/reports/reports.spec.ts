import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { Todo } from '../../models/todo.model';
import { SidebarStateService } from '../../services/sidebar-state';
import { TodoService } from '../../services/todo';
import { Reports } from './reports';

describe('Reports', () => {
  let component: Reports;
  let fixture: ComponentFixture<Reports>;
  let todos$: Subject<Todo[]>;

  beforeEach(async () => {
    todos$ = new Subject<Todo[]>();

    await TestBed.configureTestingModule({
      imports: [Reports],
      providers: [
        { provide: TodoService, useValue: { getAll: () => todos$.asObservable() } },
        { provide: SidebarStateService, useValue: { toggle: () => {} } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the report after the tasks arrive', async () => {
    expect(fixture.nativeElement.querySelector('.loading-state')).not.toBeNull();

    todos$.next([]);
    await fixture.whenStable();

    expect(component.isLoading()).toBe(false);
    expect(fixture.nativeElement.querySelector('.loading-state')).toBeNull();
    expect(fixture.nativeElement.querySelector('.stats-grid')).not.toBeNull();
  });

  it('shows an error state when tasks cannot be loaded', async () => {
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

    expect(
      fixture.nativeElement.querySelector('.stats-grid')
    ).toBeNull();
  });
});
