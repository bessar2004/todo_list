import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTodo, Todo, UpdateTodo } from '../models/todo.model';


import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
private readonly apiUrl = `${environment.apiUrl}/Todo`;


  constructor(private http: HttpClient) {}

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  create(todo: CreateTodo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  update(id: number, todo: UpdateTodo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, todo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}



// angular.json
//    ↓ hangi ortam dosyasının kullanılacağını seçer

// environment.development.ts
//    ↓ apiUrl değerini verir

//    todo.ts
//    ↓ sonuna /Todo ekler

// http://localhost:5072/api/Todo