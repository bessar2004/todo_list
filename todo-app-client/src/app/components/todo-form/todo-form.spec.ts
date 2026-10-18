import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { Todo, TodoPriority, TodoStatus } from '../../models/todo.model';
import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  let component: TodoForm;
  let fixture: ComponentFixture<TodoForm>;
  let http: HttpTestingController;
  let messages: MessageService;
  const apiUrl = 'http://localhost:5072/api/Todo';

  function fillValidForm() {
    component.todoForm.setValue({
      title: 'Yeni görev',
      description: 'Görev açıklaması',
      priority: TodoPriority.Medium,
      dueDate: null,
    });
  }

  function createdTodo(): Todo {
    return {
      id: 1,
      title: component.todoForm.controls.title.value,
      description: component.todoForm.controls.description.value,
      priority: TodoPriority.Medium,
      status: TodoStatus.Todo,
      createdAt: '2026-09-09T12:00:00',
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoForm],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoForm);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    messages = TestBed.inject(MessageService);
    await fixture.whenStable();
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should explain why an empty title prevents submission', async () => {
    component.openDialog();
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.todoForm.controls.title.hasError('required')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Görev başlığı zorunludur');
    expect(component.isSubmitting).toBe(false);
    http.expectNone(apiUrl);
  });

  it('should show the title minimum-length error without sending a request', async () => {
    component.openDialog();
    component.todoForm.patchValue({ title: 'ab', description: 'abcd' });
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Başlık en az 3 karakter olmalıdır.');
    http.expectNone(apiUrl);
  });

  it('should reject a whitespace-only title', () => {
    component.todoForm.patchValue({ title: '   ', description: '     ' });
    component.submit();

    expect(component.todoForm.controls.title.hasError('required')).toBe(true);
    http.expectNone(apiUrl);
  });

  it('should allow an empty description', () => {
    component.todoForm.patchValue({ title: 'Yeni görev', description: '' });
    component.submit();

    const request = http.expectOne({ method: 'POST', url: apiUrl });
    expect(request.request.body.description).toBeUndefined();
    request.flush(createdTodo());
  });

  it('should enforce backend maximum lengths and show the errors', async () => {
    component.openDialog();
    component.todoForm.patchValue({ title: 'a'.repeat(101), description: 'b'.repeat(501) });
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.todoForm.controls.title.hasError('maxlength')).toBe(true);
    expect(component.todoForm.controls.description.hasError('maxlength')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Başlık en fazla 100 karakter olabilir.');
    expect(fixture.nativeElement.textContent).toContain('Açıklama en fazla 500 karakter olabilir.');
    expect(fixture.nativeElement.querySelector('#title').maxLength).toBe(100);
    expect(fixture.nativeElement.querySelector('#description').maxLength).toBe(500);
    http.expectNone(apiUrl);
  });

  it('should allow exactly 100 title and 500 description characters', () => {
    component.todoForm.patchValue({ title: 'a'.repeat(100), description: 'b'.repeat(500) });
    component.submit();

    const request = http.expectOne({ method: 'POST', url: apiUrl });
    expect(request.request.body.title.length).toBe(100);
    expect(request.request.body.description.length).toBe(500);
    request.flush(createdTodo());
    expect(component.isSubmitting).toBe(false);
  });

  it('should emit the created task, close the dialog and reset after success', () => {
    fillValidForm();
    component.openDialog();
    component.todoForm.patchValue({
      title: '  Yeni görev  ',
      description: '  Görev açıklaması  ',
      dueDate: new Date(2026, 8, 21),
    });
    const emitted = vi.fn();
    component.todoCreated.subscribe(emitted);
    component.submit();

    expect(component.isSubmitting).toBe(true);
    expect(component.visible).toBe(true);
    const request = http.expectOne({ method: 'POST', url: apiUrl });
    expect(request.request.body).toEqual({
      title: 'Yeni görev',
      description: 'Görev açıklaması',
      priority: TodoPriority.Medium,
      status: TodoStatus.Todo,
      dueDate: '2026-09-21',
    });
    const saved = { ...createdTodo(), dueDate: '2026-09-21' };
    request.flush(saved);

    expect(emitted).toHaveBeenCalledExactlyOnceWith(saved);
    expect(component.isSubmitting).toBe(false);
    expect(component.visible).toBe(false);
    expect(component.todoForm.getRawValue()).toEqual({
      title: '', description: '', priority: TodoPriority.Medium, dueDate: null,
    });
  });

  it('should ignore duplicate submission while the request is pending', () => {
    fillValidForm();
    component.submit();
    component.submit();

    const requests = http.match({ method: 'POST', url: apiUrl });
    expect(requests.length).toBe(1);
    requests[0].flush(createdTodo());
  });

  it('should show an API error, preserve the form and allow retry', () => {
    component.openDialog();
    fillValidForm();
    const originalValues = component.todoForm.getRawValue();
    const messageSpy = vi.spyOn(messages, 'add');
    const emitted = vi.fn();
    component.todoCreated.subscribe(emitted);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    component.submit();
    http.expectOne({ method: 'POST', url: apiUrl })
      .flush({ message: 'Test error' }, { status: 500, statusText: 'Internal Server Error' });

    expect(component.isSubmitting).toBe(false);
    expect(component.visible).toBe(true);
    expect(component.todoForm.getRawValue()).toEqual(originalValues);
    expect(emitted).not.toHaveBeenCalled();
    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'error', summary: 'Hata',
      detail: 'Görev oluşturulamadı. Lütfen tekrar deneyin.', life: 4000,
    });

    component.submit();
    http.expectOne({ method: 'POST', url: apiUrl }).flush(createdTodo());
    expect(component.isSubmitting).toBe(false);
    expect(component.visible).toBe(false);
    expect(emitted).toHaveBeenCalledOnce();
  });
});
