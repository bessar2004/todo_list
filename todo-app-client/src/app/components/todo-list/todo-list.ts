// HostListener: sayfanin herhangi bir yerinde tiklanmasini dinliyecek
// ElementRef: Tıklanan yerin bildirim panelinin içinde mi dışında mı olduğunu kontrol etmemizi sağlayacak.
// signal : verinin degistigini Angulara haber vermesi 
import {Component,ElementRef,HostListener,OnInit,signal} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { Todo,TodoStatus,TodoPriority,UpdateTodo } from '../../models/todo.model';
import { TodoService } from '../../services/todo';
import { TodoForm } from '../todo-form/todo-form';
import { ButtonModule } from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { finalize } from 'rxjs'; // istekten sonra calisacak kodu belirler
import { ConfirmDialogModule } from 'primeng/confirmdialog';// onay pencerisini getirir.
import { ToastModule } from 'primeng/toast'; // ekranda kısa bildirim mesajları göstermek için kullanılan PrimeNG modülünü dosyana getirir:
import { SidebarStateService }
  from '../../services/sidebar-state';

  



import {
  ConfirmationService,
  MessageService
} from 'primeng/api'; // servisler dahil edildi bu kisimda 

import {
  CdkDragDrop,
  DragDropModule
} from '@angular/cdk/drag-drop';

import { FormsModule } from '@angular/forms';

import {
  Preferences
} from '../../services/preferences';

import { LanguageService } from '../../services/language';



interface TodoNotification {
  key: string; // gorevin anahtari 
  todoId: number;
  title: string;
  message: string;
  type: 'overdue' | 'upcoming';
}




@Component({
  selector: 'app-todo-list',
  imports: [
    TodoForm, 
    ButtonModule,
    TooltipModule,
    
  ReactiveFormsModule,
  DialogModule,
  InputTextModule,
  TextareaModule,
  SelectModule,
  DatePickerModule,
  ConfirmDialogModule,
  ToastModule,
DragDropModule,
FormsModule
],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {


  openMobileMenu(): void {
    this.sidebarState.toggle();
  }


  todos = signal<Todo[]>([]); // Signal to hold the list of todos
readonly TodoStatus = TodoStatus;


editDialogVisible=false; // daha Guncelleme ekrani acilmadi
selectedTodo:Todo|null=null; // Hangi görevi düzenliyoruz?
isUpdating=false; //  Güncelleme API isteği devam ediyor mu?




notificationPanelVisible = false;




// burada bildirim  butona tiklayinca okundu bilgisi verir 

// hangi bildirim  okundu 
private readonly readKey = 'readTodoNotificationKeys';
// hangi bildirim listeden kaldirildi 
private readonly dismissedKey = 'dismissedTodoNotificationKeys';

// okunan bildirimin  anahtari 
readNotificationKeys = signal<string[]>(this.loadNotificationKeys(this.readKey));
// kaldiran  listenin anahtari 
dismissedNotificationKeys = signal<string[]>(this.loadNotificationKeys(this.dismissedKey));

private loadNotificationKeys(storageKey: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');

    return Array.isArray(value)
      ? value.filter((key): key is string => typeof key === 'string')
      : [];
  } catch {
    return [];
  }
}




// İlk satır bildirimi okundu yapar 
 //Bunu şöyle oku: 
//“Bu bildirim henüz okunanlar 
// arasında yoksa listeye ekle, ekrana bildir ve 
// tarayıcıya kaydet.” [...] eski listedeki elemanları 
// koruyup yeni key değerini ekler. En sondaki 
// notificationPanelVisible = false açık bildirim 
// panelini kapatır.
markNotificationRead(key: string): void {
  if (!this.readNotificationKeys().includes(key)) {
    const updated = [...this.readNotificationKeys(), key];
    this.readNotificationKeys.set(updated);
    localStorage.setItem(this.readKey, JSON.stringify(updated));
  }

  this.notificationPanelVisible = false;
}








// duzenleme penceresi  acilir 
openNotification(notification: TodoNotification): void {
  const todo = this.todos().find(item => item.id === notification.todoId);
  if (!todo) return;

  this.markNotificationRead(notification.key);
  this.openEditDialog(todo);
}

// kaldirilan bildirimler 
dismissNotification(key: string): void {
  if (this.dismissedNotificationKeys().includes(key)) return;

  const updated = [...this.dismissedNotificationKeys(), key];
  this.dismissedNotificationKeys.set(updated);
  localStorage.setItem(this.dismissedKey, JSON.stringify(updated));
}

get unreadNotificationCount(): number {
  const readKeys = this.readNotificationKeys();

  return this.notifications.filter(
    notification => !readKeys.includes(notification.key)
  ).length;
}





//  burada Bildirimi  hesaplayan 
get notifications(): TodoNotification[] {


if (!this.preferences.notificationsEnabled()) {
  return [];
}


  const notifications: TodoNotification[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const todo of this.todos()) {
    if (todo.status === TodoStatus.Completed || !todo.dueDate) {
      continue;
    }

const dueDate =
  this.language.parseDate(todo.dueDate);

if (!dueDate) {
  continue;
}

    dueDate.setHours(0, 0, 0, 0);

    const differenceInDays = Math.round(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays > 3) {
      continue;
    }

    const type: TodoNotification['type'] =
      differenceInDays < 0 ? 'overdue' : 'upcoming';

    const key = `${todo.id}:${todo.dueDate}:${type}`;

    if (this.dismissedNotificationKeys().includes(key)) {
      continue;
    }

  let message: string;

if (differenceInDays < 0) {
  message = this.language.translate(
    'notification.overdue'
  );
} else if (differenceInDays === 0) {
  message = this.language.translate(
    'notification.today'
  );
} else if (differenceInDays === 1) {
  message = this.language.translate(
    'notification.tomorrow'
  );
} else {
  message = this.language.translate(
    'notification.daysRemaining',
    { count: differenceInDays }
  );
}

    notifications.push({
      key,
      todoId: todo.id,
      title: todo.title,
      message,
      type
    });
  }

  return notifications;
}







toggleNotificationPanel(): void {
  this.notificationPanelVisible =
    !this.notificationPanelVisible;
}

// BURAYA EKLE
//  Bildirim paneli açıkken kullanıcı panelin dışına tıklarsa paneli kapatmak
@HostListener('document:click', ['$event'])
closeNotificationPanelOnOutsideClick(event: MouseEvent): void {
  if (!this.notificationPanelVisible) {
    return;
  }

  // kullanicini tikladigi element alanidir 
  const clickedElement = event.target;

  if (!(clickedElement instanceof Node)) {
    return;
  }

  // Bildirim alanını HTML’de buluyor
  const notificationWrapper =
    this.elementRef.nativeElement.querySelector<HTMLElement>(
      '.notification-wrapper'
    );

    // Tiklama disarda  olup olmadigini kontrol eder  
  if (
    notificationWrapper &&
    !notificationWrapper.contains(clickedElement)
  ) {
    this.notificationPanelVisible = false; // panaeli kapat 
  }
}







searchTerm='';

selectedPriority:TodoPriority|null=null;
selectedStatus:TodoStatus|null=null;






// Üst öncelik filtresinde çevrilmiş öncelik seçeneklerini kullanır.
get filterPriorityOptions() {
  return this.priorityOptions;

}

// Üst durum filtresinde çevrilmiş durum seçeneklerini kullanır.
get filterStatusOptions() {
  return this.statusOptions;
}


// fitrelenmis bir todo listesi  dondurulur 
get filteredTodos(): Todo[]{

 const locale =
    this.language.currentLocale;


const term=
this.searchTerm.trim()
.toLocaleLowerCase(locale);


return this.todos().filter(todo=>

{

const title=
todo.title.toLocaleLowerCase(locale);


 const description =
      (todo.description ?? '')
        .toLocaleLowerCase(locale);


        const matchesSearch =
      !term ||
      title.includes(term) ||
      description.includes(term);




      const matchesPriority =
      this.selectedPriority === null ||
      //Şu anda kontrol edilen görevin önceliği, kullanıcının seçtiği öncelikle aynı m
      todo.priority === this.selectedPriority;





      const matchesStatus =
      this.selectedStatus === null ||
      todo.status === this.selectedStatus;


 return (
      matchesSearch &&
      matchesPriority &&
      matchesStatus
    );



}


)



}


// Düzenleme penceresindeki öncelik seçeneklerini seçili dile göre hazırlar.
get priorityOptions() {
  return [
    {
      label: this.language.translate('priority.low'),
      value: TodoPriority.Low
    },
    {
      label: this.language.translate('priority.medium'),
      value: TodoPriority.Medium
    },
    {
      label: this.language.translate('priority.high'),
      value: TodoPriority.High
    }
  ];
}

// Düzenleme penceresindeki durum seçeneklerini seçili dile göre hazırlar.
get statusOptions() {
  return [
    {
      label: this.language.translate('taskList.todoTitle'),
      value: TodoStatus.Todo
    },
    {
      label: this.language.translate('taskList.progressTitle'),
      value: TodoStatus.InProgress
    },
    {
      label: this.language.translate('taskList.completedTitle'),
      value: TodoStatus.Completed
    }
  ];
}

// burada form kontrolunu saglamak icin
editForm=new FormGroup({


  title:new FormControl('',{

nonNullable:true,
validators:[
Validators.required,
Validators.maxLength(100)

]

  }),

  description:new FormControl('',{

    nonNullable:true,
    validators:[
      Validators.maxLength(500)
    ]
  }),


  status:new FormControl(

    TodoStatus.Todo,
    {
      nonNullable:true
    }

  ),

  priority:new FormControl(

    TodoPriority.Medium,
    {
      nonNullable:true
    }


  ),

dueDate:new FormControl<Date |null>(null)



});


openEditDialog(todo:Todo):void{


  this.selectedTodo=todo;


  this.editForm.reset({


    title:todo.title,

    description:
    todo.description??'',

    status:
    todo.status,


    priority:
    todo.priority,

  dueDate:
  this.language.parseDate(todo.dueDate)


  });

  this.editDialogVisible=true; // gunceleme formu acilir 

}


// void: geriye herhangi bir deger dondermiyecek
closeEditDialog():void{

this.editDialogVisible=false; // guncelleme ekrani kapandi  bu kisimda 
this.selectedTodo=null; //  gorevler bos  



}

// Guncelleme Gerceklesecek
updateTodo():void{


// Form hatalıysa true olur. Örneğin başlık boş bırakılmışsa
//Düzenlenecek görev seçilmemişse true olur.
  if(
    this.editForm.invalid||
    this.selectedTodo===null
  ){

    this.editForm.markAllAsTouched(); //  Formdaki bütün alanları kullanıcı dokunmuş gibi işaretler. Böylece doğrulama hata mesajları görünür

    return;


  }



//Bu satır, düzenleme formundaki dueDate alanının değerini alıp date isimli değişkene koyar.
  const date=this.editForm.controls.dueDate.value;


  const updatedTodo:UpdateTodo={



    title:
    this.editForm.controls.title.value.trim(),

    description:
    this.editForm.controls.description.value.trim()||undefined,



    status:
      this.editForm.controls.status.value,

    priority:
      this.editForm.controls.priority.value,

    dueDate:
      date
        ? this.formatDateForApi(date)
        : undefined

  };

    const todo=
      this.selectedTodo;
  this.isUpdating=true; // Gunceleme suruyor 

  this.todoService.update(todo.id,updatedTodo).pipe(
    finalize(()=>{
      this.isUpdating=false; // Guncelleme bitti 

    })
  )
  
  .subscribe({
    next: () => {
      this.todos.update((todos) =>
        todos.map((item) =>
          item.id === todo.id
            ? {
                ...item,
                ...updatedTodo
              }
            : item
        )
      );

      this.closeEditDialog(); // pencereyi kapat 




this.messageService.add({
  severity: 'success',
  summary: this.language.translate(
    'taskMessage.success'
  ),
  detail: this.language.translate(
    'taskMessage.updateSuccess'
  ),
  life: 3000
});






    },


    
    error:(error: unknown)=>{

this.isUpdating=false;

console.error(

  'Görev güncellenemedi:',
  error
);


this.messageService.add({
  severity: 'error',
  summary: this.language.translate(
    'todoForm.error'
  ),
  detail: this.language.translate(
    'taskMessage.updateError'
  ),
  life: 4000
});


    }




  });

}











get todoTasks(): Todo[] {

  return this.filteredTodos.filter(
    todo =>
      todo.status === TodoStatus.Todo
  );
}

get inProgressTasks(): Todo[] {

  return this.filteredTodos.filter(
    todo =>
      todo.status === TodoStatus.InProgress
  );
}


get doneTasks(): Todo[] {

  return this.filteredTodos.filter(
    todo =>
      todo.status === TodoStatus.Completed
  );
}


getPriorityLabel(priority: TodoPriority): string {
  switch (priority) {
    case TodoPriority.High:
      return this.language.translate('priority.high');

    case TodoPriority.Medium:
      return this.language.translate('priority.medium');

    case TodoPriority.Low:
      return this.language.translate('priority.low');

    default:
      return '';
  }
}




getPriorityClass(priority:TodoPriority):string
{


  switch(priority)

  {

    case TodoPriority.High:
      return'priority-high';

    case TodoPriority.Medium:
      return'priority-medium';


    case TodoPriority.Low:
      return'priority-low';

       default:
      return '';


  }

}

  constructor(private todoService: TodoService,
    private confirmationService:ConfirmationService,
    private messageService:MessageService,
    private elementRef: ElementRef<HTMLElement>,
    private sidebarState: SidebarStateService,
    public preferences: Preferences,
      public language: LanguageService

    
  ) {}

  ngOnInit(): void {
  this.loadTodos();
}

  loadTodos(): void {
    this.todoService.getAll().subscribe({
      next: (data: Todo[]) => {
        this.todos.set(data); // Update the signal with the fetched todos
      },
      error: (error: unknown) => {
        console.error('Görevler alınamadı:', error);
       this.messageService.add({
  severity: 'error',
  summary: this.language.translate(
    'todoForm.error'
  ),
  detail: this.language.translate(
    'taskMessage.loadError'
  ),
  life: 4000
});
      },
    });
  }

  // turkce "Yeni görev oluşturulduğunda çağrılacak fonksiyon"
  
  onTodoCreated(todo: Todo): void {
    // Yeni oluşturulan görevi listeye ekle
    this.todos.update((todos) => 
      [todo, ...todos]); // listeyi güncelle


this.messageService.add({
  severity: 'success',
  summary: this.language.translate(
    'taskMessage.createdTitle'
  ),
  detail: this.language.translate(
    'taskMessage.createdDetail',
    { title: todo.title }
  ),
  life: 3000
});




  }










deleteTodo(todo:Todo):void{


this.confirmationService.confirm({

header: this.language.translate(
  'taskMessage.deleteTitle'
),

message: this.language.translate(
  'taskMessage.deleteConfirm',
  { title: todo.title }
),

acceptLabel: this.language.translate(
  'taskList.delete'
),

rejectLabel: this.language.translate(
  'todoForm.cancel'
),


acceptButtonStyleClass:
'p-button-danger',

rejectButtonStyleClass:
      'p-button-outlined p-button-secondary',





      accept: () => { 

      this.todoService
        .delete(todo.id)
        .subscribe({

          next:()=> {


            this.todos.update((todos) =>
              todos.filter((item) => item.id !== todo.id)
            );

           this.messageService.add({
  severity: 'success',
  summary: this.language.translate(
    'taskMessage.success'
  ),
  detail: this.language.translate(
    'taskMessage.deleteSuccess'
  ),
  life: 3000
});
          },


          error:(error)=>{

          console.error(
          'Görev Silinmedi:',
         error
         );



          this.messageService.add({
  severity: 'error',
  summary: this.language.translate(
    'todoForm.error'
  ),
  detail: this.language.translate(
    'taskMessage.deleteError'
  ),
  life: 4000
});



          }
        });
      }
    });





}





private formatDateForApi(
  date: Date
): string {

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, '0');

  const day =
    String(date.getDate())
      .padStart(2, '0');

 return `${year}-${month}-${day}`;
}

//  bir kartı başka sütuna bıraktığında 
// görevin durumunu backend’e kaydetmek için yazılmış
drop(
  event:CdkDragDrop<Todo[]>,
  newStatus:TodoStatus

):void{

  //sürüklediğin karta ait görev bilgilerini todo değişkenine alıyor
  const todo=event.item.data as Todo;



  const oldStatus=todo.status;

  if(oldStatus===newStatus)
  {
    return;

  }


  const updatedTodo:UpdateTodo={

    title:todo.title,
    description:todo.description,
    status:newStatus,
    priority:todo.priority,
    dueDate:todo.dueDate

  };

// ekranda aninda diger sutuna tasi
  this.todos.update((todos) =>
    todos.map((item) =>
      item.id === todo.id ? { ...item, status: newStatus } : item
    )
  );


  this.todoService.update(todo.id,updatedTodo)
  .subscribe({

next:() => {


this.messageService.add({
  severity: 'success',
  summary: this.language.translate(
    'taskMessage.statusUpdatedTitle'
  ),
  detail: this.language.translate(
    'taskMessage.statusUpdatedDetail',
    {
      status: this.getStatusLabel(newStatus)
    }
  ),
  life: 2500
});


},

error:(error) =>{

// Api basarsizsa eski sutuna geri al 
this.todos.update((todos) =>
  todos.map((item) =>
    item.id === todo.id ? { ...item, status: oldStatus } : item
  )
);


  console.error(
          'Görev durumu güncellenemedi:',
          error
        );


this.messageService.add({
  severity: 'error',
  summary: this.language.translate(
    'todoForm.error'
  ),
  detail: this.language.translate(
    'taskMessage.statusUpdateError'
  ),
  life: 4000
});
}

  });

}



getStatusLabel(status: TodoStatus): string {
  switch (status) {
    case TodoStatus.Todo:
      return this.language.translate('taskList.todoTitle');

    case TodoStatus.InProgress:
      return this.language.translate('taskList.progressTitle');

    case TodoStatus.Completed:
      return this.language.translate('taskList.completedTitle');

    default:
      return '';
  }
}


















}








