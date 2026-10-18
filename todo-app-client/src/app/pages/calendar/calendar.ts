import { Component, OnInit,signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Todo, TodoPriority, TodoStatus } from '../../models/todo.model';
import { TodoService }
  from '../../services/todo';
import { SidebarStateService }
  from '../../services/sidebar-state';

  import { LanguageService } from '../../services/language';


  import { DialogModule } from 'primeng/dialog';



interface CalendarDay {
  date: Date;
  dayNumber: number;
  currentMonth: boolean;
  todos: Todo[];

  
}



  @Component({
  selector: 'app-calendar',
  imports: [ButtonModule,DialogModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar    implements OnInit{

 // hangi goreve tikladik  
  selectedTodo: Todo | null = null;
  // detay ekrani acik mi ? 
  detailDialogVisible = false;




// acma 
  openTaskDetail(todo: Todo): void {

  this.selectedTodo = todo;

  this.detailDialogVisible = true;
}


// kapatma 
closeTaskDetail(): void {

  this.detailDialogVisible = false;

  this.selectedTodo = null;
}


getStatusLabel(
  status: TodoStatus
): string {
  switch (status) {
    case TodoStatus.Todo:
      return this.language.translate(
        'taskList.todoTitle'
      );

    case TodoStatus.InProgress:
      return this.language.translate(
        'taskList.progressTitle'
      );

    case TodoStatus.Completed:
      return this.language.translate(
        'taskList.completedTitle'
      );

    default:
      return '';
  }
}



getPriorityLabel(
  priority: TodoPriority
): string {
  switch (priority) {
    case TodoPriority.High:
      return this.language.translate(
        'priority.high'
      );

    case TodoPriority.Medium:
      return this.language.translate(
        'priority.medium'
      );

    case TodoPriority.Low:
      return this.language.translate(
        'priority.low'
      );

    default:
      return '';
  }
}




getStatusClass(
  status: TodoStatus
): string {

  switch (status) {

    case TodoStatus.Todo:
      return 'status-todo';

    case TodoStatus.InProgress:
      return 'status-progress';

    case TodoStatus.Completed:
      return 'status-done';

    default:
      return '';
  }
}





todos:Todo[]=[];

 isLoading = signal(true);
hasLoadError = signal(false);

calendarDays:CalendarDay[]=[];
currentDate=new Date();



// Haftanın günlerini seçilen dile göre hazırlar.
get weekDays(): string[] {
  return [
    this.language.translate(
      'calendar.weekday.monday'
    ),
    this.language.translate(
      'calendar.weekday.tuesday'
    ),
    this.language.translate(
      'calendar.weekday.wednesday'
    ),
    this.language.translate(
      'calendar.weekday.thursday'
    ),
    this.language.translate(
      'calendar.weekday.friday'
    ),
    this.language.translate(
      'calendar.weekday.saturday'
    ),
    this.language.translate(
      'calendar.weekday.sunday'
    )
  ];
}



 constructor(
    private todoService: TodoService,
    private sidebarState: SidebarStateService,
      public language: LanguageService

  ) {}

  openMobileMenu(): void {
    this.sidebarState.toggle();
  }

    ngOnInit(): void {

    this.loadTodos();

  }

  loadTodos(): void {
  this.isLoading.set(true);
  this.hasLoadError.set(false);

  this.todoService
    .getAll()
    .subscribe({
      next: (todos: Todo[]) => {
        this.todos = todos;
        this.buildCalendar();

        this.isLoading.set(false);
      },

      error: (error: unknown) => {
        console.error(
          'Takvim görevleri yüklenemedi:',
          error
        );

        this.hasLoadError.set(true);
        this.isLoading.set(false);
      }
    });
}

// Bu getter, takvimin üst kısmındaki ay ve yıl başlığını seçili dile göre hazırlar
get monthTitle(): string {
  return new Intl.DateTimeFormat(
    this.language.currentLocale,
    {
      month: 'long',
      year: 'numeric',
      calendar: 'gregory'
    }
  ).format(this.currentDate);
}




// bir ay once 
  previousMonth(): void {

  this.currentDate =
    new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );

  this.buildCalendar();

}

// bir ay ileri 
nextMonth(): void {

  this.currentDate =
    new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );

  this.buildCalendar();

}

// bugune geri  don 
goToday(): void {

  this.currentDate = new Date();

  this.buildCalendar();

}





buildCalendar(): void {

  const year =
    this.currentDate.getFullYear();

  const month =
    this.currentDate.getMonth();


  const firstDay =
    new Date(year, month, 1);


  const lastDay =
    new Date(year, month + 1, 0);


  let startDay =
    firstDay.getDay();

  // JS:
  // Pazar = 0
  // Pazartesi = 1
  //
  // Biz:
  // Pazartesi ile başlıyoruz.

  startDay =
    startDay === 0
      ? 6
      : startDay - 1;


  const days: CalendarDay[] = [];


  // Önceki aydan görünen günler

  for (
    let i = startDay;
    i > 0;
    i--
  ) {

    const date =
      new Date(
        year,
        month,
        1 - i
      );

    days.push(
      this.createCalendarDay(
        date,
        false
      )
    );

  }


  // İçinde bulunduğumuz ay

  for (
    let day = 1;
    day <= lastDay.getDate();
    day++
  ) {

    const date =
      new Date(
        year,
        month,
        day
      );

    days.push(
      this.createCalendarDay(
        date,
        true
      )
    );

  }


  // 6 satırlık takvim = 42 hücre

  while (days.length < 42) {

    const lastDate =
      days[days.length - 1].date;

    const date =
      new Date(lastDate);

    date.setDate(
      lastDate.getDate() + 1
    );

    days.push(
      this.createCalendarDay(
        date,
        false
      )
    );

  }


  this.calendarDays = days;

}


private createCalendarDay(
  date: Date,
  currentMonth: boolean
): CalendarDay {

  return {

    date,
// tarih ten sayiyi alir 
    dayNumber:
      date.getDate(),

    currentMonth,

    // Gorevleri alir 
    todos:
      this.getTodosForDate(date)

  };

}

// tarihleri karsilastiriyor ayni mi diye ?

private getTodosForDate(date: Date): Todo[] {
  return this.todos.filter((todo) => {
    // parseDate() ile güvenli tarihe çevrilir
    const dueDate =
      this.language.parseDate(todo.dueDate);

    if (!dueDate) {
      return false;
    }

    return (
      dueDate.getFullYear() === date.getFullYear() &&
      dueDate.getMonth() === date.getMonth() &&
      dueDate.getDate() === date.getDate()
    );
  });
}




getPriorityClass(
  priority: TodoPriority
): string {

  switch (priority) {

    case TodoPriority.High:
      return 'calendar-task-high';

    case TodoPriority.Medium:
      return 'calendar-task-medium';

    case TodoPriority.Low:
      return 'calendar-task-low';

    default:
      return '';
  }

}


  
}
