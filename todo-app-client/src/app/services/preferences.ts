import { Injectable,signal } from '@angular/core';
import {TodoPriority}  from '../models/todo.model';




// kullanıcının uygulama tercihlerini yöneten merkezî servistir. 


@Injectable({
  providedIn: 'root',
})
export class Preferences {

  
isDarkMode=signal(false);


// Bildirim tercihinin başlangıç değeri: açık.
notificationsEnabled=signal(true);



// varsayilan ayari ayarliyor 

defaultPriority=
signal<TodoPriority>(
  TodoPriority.Medium
);


constructor() {
  this.loadPreferences();
}



  setTheme(
    darkMode: boolean
  ): 
  
  void {

    this.isDarkMode.set(
      darkMode
    );

 document
      .documentElement
      .classList
      .toggle(
        'app-dark',
        darkMode
      );

 localStorage.setItem(
      'theme',
      darkMode
        ? 'dark'
        : 'light'
    );

  }


  // Bildirim tercihini günceller ve tarayıcıya kaydeder.
setNotifications(
    enabled: boolean
  ): void {

    this.notificationsEnabled.set(
      enabled
    );

    localStorage.setItem(
      'notificationsEnabled',
      String(enabled)
    );

  }




// oncelikleri tarayicida saklar ve  kaydeder 
 setDefaultPriority(priority: TodoPriority): void {

    this.defaultPriority.set(priority);



 localStorage.setItem('defaultPriority',String(priority));
}





private loadPreferences(): void {

    const savedTheme =
      localStorage.getItem(
        'theme'
      );

    const savedNotifications =
      localStorage.getItem(
        'notificationsEnabled'
      );

    const savedPriority =
      localStorage.getItem(
        'defaultPriority'
      );


    this.setTheme(
      savedTheme === 'dark'
    );


    if (
      savedNotifications !== null
    ) {

      this.notificationsEnabled.set(
        savedNotifications === 'true'
      );

    }


   if (savedPriority !== null) {
  const priority = Number(savedPriority);

  if (
    priority === TodoPriority.Low ||
    priority === TodoPriority.Medium ||
    priority === TodoPriority.High
  ) {
    this.defaultPriority.set(priority);
  }
}
}



}
