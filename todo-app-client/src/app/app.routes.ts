import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout')
        .then(module => module.AuthLayout),

    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login')
            .then(module => module.Login)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register')
            .then(module => module.Register)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password')
            .then(module => module.ForgotPassword)
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password')
            .then(module => module.ResetPassword)
      }
    ]
  },

  {
    path: '',
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout')
        .then(module => module.DashboardLayout),

    children: [
      {
        path: 'tasks',
        loadComponent: () =>
          import('./components/todo-list/todo-list')
            .then(module => module.TodoList)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/calendar/calendar')
            .then(module => module.Calendar)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports')
            .then(module => module.Reports)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings')
            .then(module => module.Settings)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];







// Not:


// Burada olan şu:
// - /login, /register ve /forgot-password sayfaları AuthLayout içinde açılır. Bu sayfalarda sidebar görünmez.
// - /tasks, /calendar, /reports ve /settings sayfaları DashboardLayout içinde açılır. Sidebar yalnızca burada görünür.
// - children, hangi sayfaların hangi layout’un içine yerleşeceğini belirler.
// - loadComponent, component’i yalnızca ihtiyaç duyulduğu zaman yükler.
// - Bilinmeyen bir adres girilirse ** kullanıcıyı /login sayfasına gönderir.
