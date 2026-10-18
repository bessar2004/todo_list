
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}




















// Not:

// App
// └── router-outlet
//     ├── AuthLayout
//     │   └── Login / Register / Forgot Password
//     └── DashboardLayout
//         ├── Sidebar
//         └── Tasks / Calendar / Reports / Settings