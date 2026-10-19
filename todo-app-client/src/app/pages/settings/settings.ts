import { Component } from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import { 
  SidebarStateService 
}  from '../../services/sidebar-state';


import {
  AppLanguage,
  LanguageService
} from '../../services/language';


import {
  ButtonModule
} from 'primeng/button';

import {
  SelectModule
} from 'primeng/select';

import {
  ToggleSwitchModule
} from 'primeng/toggleswitch';

import {
  MessageService
} from 'primeng/api';

import {
  ToastModule
} from 'primeng/toast';

import {
  TodoPriority
} from '../../models/todo.model';

import {
  Preferences
} from '../../services/preferences';
import { ProfileSettings } from '../../components/profile-settings/profile-settings';



@Component({
  selector: 'app-settings',
  imports: [  FormsModule,
    ButtonModule,
    SelectModule,
    ToggleSwitchModule,
    ToastModule, ProfileSettings],
     providers: [
    MessageService
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})


export class Settings {



// Ayarlar ekranında seçilen dili tutar.
selectedLanguage: AppLanguage;

// Dil seçim kutusunda gösterilecek seçenekler.
languageOptions: {
  label: string;
  value: AppLanguage;
}[] = [
  {
    label: 'Türkçe',
    value: 'tr'
  },
  {
    label: 'English',
    value: 'en'
  },
  {
    label: 'العربية',
    value: 'ar'
  }
];








 // Ayarlar ekranındaki mevcut tercihleri tutar.
 isDarkMode: boolean;

  notificationsEnabled: boolean;

  defaultPriority: TodoPriority;



// Seçili dile göre öncelik seçeneklerini hazırlar.
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
 




 // Servisteki mevcut tercihleri ekrana alır.
 constructor(
    private preferences:
      Preferences,

    private messageService:
      MessageService ,

        private sidebarState: SidebarStateService,
          public language: LanguageService
  )
  
  
  
  
  {

    this.selectedLanguage =
      this.language.currentLanguage();
    
    this.isDarkMode =
      this.preferences
        .isDarkMode();

    this.notificationsEnabled =
      this.preferences
        .notificationsEnabled();

    this.defaultPriority =
      this.preferences
        .defaultPriority();

  }

  
// Mobil menüyü açıp kapatır.
openMobileMenu(): void {
  this.sidebarState.toggle();
}


// Seçilen temayı hemen uygular.
selectTheme(
    darkMode: boolean
  ): void {

    this.isDarkMode =
      darkMode;

    this.preferences
      .setTheme(
        darkMode
      );

  }


  // Seçilen tercihleri kaydeder.
  saveSettings(): void {

    this.preferences
      .setTheme(
        this.isDarkMode
      );


    this.preferences
      .setNotifications(
        this.notificationsEnabled
      );


    this.preferences
      .setDefaultPriority(
        this.defaultPriority
      );

// Seçilen dili uygular ve tarayıcıya kaydeder.

      this.language.setLanguage(
  this.selectedLanguage
);


    // Kullanıcıya kısa bir başarı mesajı gösterir.
this.messageService.add({
  severity: 'success',

  summary:
    this.language.translate(
      'settings.saved'
    ),

  detail:
    this.language.translate(
      'settings.savedMessage'
    ),

  life: 3000
});

  }






}
