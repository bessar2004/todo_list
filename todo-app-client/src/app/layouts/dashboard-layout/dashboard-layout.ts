import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { RouterOutlet } from '@angular/router';

import { Sidebar }
  from '../../components/sidebar/sidebar';

import { SidebarStateService }
  from '../../services/sidebar-state';


@Component({
  selector: 'app-dashboard-layout',
  imports: [ RouterOutlet,Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout implements OnInit {


constructor(
  public sidebarState: SidebarStateService,
  private readonly auth: AuthService
) {}

ngOnInit(): void {
  const token = this.auth.getAccessToken();

  if (!token) {
    return;
  }

  this.auth.getCurrentUser().subscribe({
    next: user => {
      if (this.auth.getAccessToken() === token) {
        this.auth.currentUser.set(user);
      }
    },

  
    error: () => {
      if (this.auth.getAccessToken() === token) {
        this.auth.currentUser.set(null);
      }
    }
  });
}

closeSidebar(): void {
  this.sidebarState.close();
}


}
