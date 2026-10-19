import { Component } from '@angular/core';

import { AuthService } from '../../services/auth';

import {
  LanguageService
} from '../../services/language';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import {
  EventEmitter,
  Input,
  Output
} from '@angular/core';
@Component({
  selector: 'app-sidebar',
 imports: [
  RouterLink,
  RouterLinkActive
],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {

 @Input() isOpen = false;// sidbarin acik mi kapali mi 

  @Output() closeSidebar =new EventEmitter<void>(); // kapali oldugunda bana haber verecek

constructor(
  public language: LanguageService,
    public readonly auth: AuthService,

    private readonly router: Router

) {}



MenuItems = [
  {
    labelKey: 'nav.tasks',
    icon: 'pi pi-check-square',
    route: '/tasks'
  },
  {
    labelKey: 'nav.calendar',
    icon: 'pi pi-calendar',
    route: '/calendar'
  },
  {
    labelKey: 'nav.reports',
    icon: 'pi pi-chart-bar',
    route: '/reports'
  },
  {
    labelKey: 'nav.settings',
    icon: 'pi pi-cog',
    route: '/settings'
  }
];
  close(): void {
    this.closeSidebar.emit();
  }

logout(): void {
  // Kullanıcıyı çıkış yapar ve tarayıcıda saklanan giriş token'ını temizler.
  this.auth.logout();
  // Kullanıcıyı giriş sayfasına yönlendirir ve tarayıcı geçmişini temizler.
  this.close();

  void this.router.navigate(['/login'], {
    replaceUrl: true
  });
}


}
