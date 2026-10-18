import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Todo, TodoPriority, TodoStatus } from '../../models/todo.model';
import { TodoList } from './todo-list';

describe('TodoList', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;

  function createTodo(overrides: Partial<Todo>): Todo {
    return {
      id: 1,
      title: 'Test görevi',
      description: 'Test açıklaması',
      status: TodoStatus.Todo,
      priority: TodoPriority.Medium,
      createdAt: '2026-09-01T12:00:00',
      ...overrides,
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoList],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne({ method: 'GET', url: 'http://localhost:5072/api/Todo' })
      .flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create overdue, today and upcoming notifications', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 11, 12, 0, 0));

    component.todos.set([
      createTodo({ id: 1, title: 'Geciken görev', dueDate: '2026-09-10T00:00:00' }),
      createTodo({ id: 2, title: 'Bugünkü görev', dueDate: '2026-09-11T00:00:00' }),
      createTodo({ id: 3, title: 'Yaklaşan görev', dueDate: '2026-09-14T00:00:00' }),
    ]);

    expect(component.notifications).toEqual([
      {
        key: '1:2026-09-10T00:00:00:overdue',
        todoId: 1,
        title: 'Geciken görev',
        message: 'Bu görevin son tarihi geçti.',
        type: 'overdue',
      },
      {
        key: '2:2026-09-11T00:00:00:upcoming',
        todoId: 2,
        title: 'Bugünkü görev',
        message: 'Bu görevin son tarihi bugün.',
        type: 'upcoming',
      },
      {
        key: '3:2026-09-14T00:00:00:upcoming',
        todoId: 3,
        title: 'Yaklaşan görev',
        message: 'Son tarihe 3 gün kaldı.',
        type: 'upcoming',
      },
    ]);
  });

  it('should ignore completed, undated and distant tasks', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 11, 12, 0, 0));

    component.todos.set([
      createTodo({
        id: 1,
        status: TodoStatus.Completed,
        dueDate: '2026-09-10T00:00:00',
      }),
      createTodo({ id: 2, dueDate: undefined }),
      createTodo({ id: 3, dueDate: '2026-09-15T00:00:00' }),
    ]);

    expect(component.notifications).toEqual([]);
  });

  it('should open and close the notification panel when the bell button is clicked', () => {
    const notificationButton = () =>
      fixture.nativeElement.querySelector('.notification-button') as HTMLButtonElement;

    expect(component.notificationPanelVisible).toBe(false);
    expect(notificationButton().getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('.notification-panel')).toBeNull();

    notificationButton().click();
    fixture.detectChanges();

    expect(component.notificationPanelVisible).toBe(true);
    expect(notificationButton().getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.notification-panel')).not.toBeNull();

    notificationButton().click();
    fixture.detectChanges();

    expect(component.notificationPanelVisible).toBe(false);
    expect(notificationButton().getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('.notification-panel')).toBeNull();
  });
});
