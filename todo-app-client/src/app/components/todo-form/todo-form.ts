import { Component, output } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule,Validators,}from '@angular/forms';
import { CreateTodo, Todo, TodoPriority, TodoStatus } from '../../models/todo.model';
import { TodoService } from '../../services/todo';
import { DialogModule } from 'primeng/dialog';// pencere acmak 
import { ButtonModule } from 'primeng/button'; // buton olustur 
import { InputTextModule } from 'primeng/inputtext';// gorev basligi 
import { TextareaModule } from 'primeng/textarea'; // gorev aciklamasi
import { SelectModule } from 'primeng/select';// secenek listesini gosterir
import {DatePickerModule} from 'primeng/datepicker'; // takvimden tarih sectirir.
import { MessageService } from 'primeng/api';

import { LanguageService } from '../../services/language';


import {
  Preferences
} from '../../services/preferences';



@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule,DialogModule,ButtonModule,InputTextModule,TextareaModule,SelectModule,DatePickerModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
})





export class TodoForm {

  isSubmitting = false;

visible=false;  //Diyalog kapali 

openDialog(): void {

  this.todoForm.reset({

    title: '',

    description: '',

    priority:
      this.preferences
        .defaultPriority(),

    dueDate: null

  });

  this.visible = true;
}

closeDialog(): void {
  this.visible = false;
}


// Öncelik seçeneklerini seçilen dile göre hazırlar.
get priorities() {
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

  readonly todoCreated = output<Todo>();
  readonly todoForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    priority: new FormControl<TodoPriority>(TodoPriority.Medium, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dueDate: new FormControl<Date | string | null>(null),
  
  });



  constructor(
    private todoService: TodoService,
    private messageService: MessageService,
    private preferences:
    Preferences,
      public language: LanguageService

  ) {}

  submit(): void {
    // burada buton durur 
    if (this.isSubmitting) {
      return;
    }

    // Kenar boşluklarını temizle; yalnızca boşluk yazılmış alanlar da geçersiz olsun.
    this.todoForm.controls.title.setValue(this.todoForm.controls.title.value.trim());
    this.todoForm.controls.description.setValue(this.todoForm.controls.description.value.trim());

    // Form geçerliliğini kontrol et
    if (this.todoForm.invalid) {
      // Tüm alanları işaretle ve kullanıcıya hata mesajlarını göster
      this.todoForm.markAllAsTouched();
      return;
    }

const date=this.todoForm.controls.dueDate.value;

    // CreateTodo nesnesini oluştur
    const newTodo: CreateTodo = {
      // Form alanlarından değerleri al
      title: this.todoForm.controls.title.value,
      // Açıklama ve son tarih isteğe bağlıdır.
      description: this.todoForm.controls.description.value || undefined,
      priority: this.todoForm.controls.priority.value,
      status: TodoStatus.Todo,
      dueDate: date ? this.formatDateForApi(date) : undefined,
    };

    this.isSubmitting = true;
    this.todoService.create(newTodo).subscribe({
      next: (createdTodo: Todo) => {
        this.todoCreated.emit(createdTodo); // Yeni oluşturulan görevi dışarıya ilet
        this.isSubmitting = false;// 
        this.visible=false;
        this.todoForm.reset(); // Formu temizle
      },
      // Hata durumunda kullanıcıya hata mesajını göster
      error: (error: unknown) => {
        this.isSubmitting = false;
        console.error('Görev oluşturulamadı:', error);
   this.messageService.add({
  severity: 'error',
  summary: this.language.translate('todoForm.error'),
  detail: this.language.translate('todoForm.createError'),
  life: 4000
});
      },
    });



  }





  

  private formatDateForApi(date: Date | string): string {
    // Normal HTML tarih alanı metin, DatePicker ise Date nesnesi verir.
    if (typeof date === 'string') {
      return date;
    }

    // Seçilen günü saat dilimi nedeniyle değiştirmeden YYYY-MM-DD biçimine çevir.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

restForm(): void{

this.todoForm.reset({

  title:'',
  description:'',
  priority:TodoPriority.Medium,
  dueDate:null
});

}


}




// dosyasnin  Akisi 

// Kullanıcı formu doldurur
// → submit() çalışır
// → Alanlar kontrol edilir
// → CreateTodo nesnesi oluşturulur
// → TodoService backend’e POST isteği gönderir
// → Backend yeni görevi döndürür
// → Form temizlenir
