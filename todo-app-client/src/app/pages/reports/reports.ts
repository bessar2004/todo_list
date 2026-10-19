import { Component, OnInit, signal } from '@angular/core';
import type { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import {Todo,TodoPriority,TodoStatus} from '../../models/todo.model';
import { SidebarStateService }
  from '../../services/sidebar-state';
import { TodoService }
  from '../../services/todo';


import { LanguageService } from '../../services/language';


@Component({
  selector: 'app-reports',
  imports: [ChartModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports  implements OnInit {



 todos:Todo[]=[]; // Backendden gelen verileri tutacak dizidir 

  isLoading = signal(true); //  yukleniyor  bilgisi 

hasLoadError = signal(false);

  // istatistikler 

  
 totalCount = 0; // gorevlerin sayisi tutar 

  todoCount = 0; // Yapilacak gorev sayisini tutar

  inProgressCount = 0;  // Devam ediyor 

  doneCount = 0; // Tamamlanmış görev sayısıdır

  overdueCount = 0; // son tarih gecmis fakat tamamlanmamis gorev sayisidir

  completionRate = 0; // gorevleri yuzde kac tamamladigini tutar 


// Grafik verileri

  statusChartData!: ChartData<'doughnut'>; // gorev  durumlar gostern grafigin verilerini tutar 

  statusChartOptions!: ChartOptions<'doughnut'>; // gorunum grafigini ayarlar yazilar,renkler,aciklama alani,grafik boyutu

  priorityChartData!: ChartData<'bar'>; //  Görevlerin önceliklerine göre grafik verilerini tutar:

  priorityChartOptions!: ChartOptions<'bar'>; // oncelık grafıgın gorunum  ayarlarını tutar 

  constructor(
    private todoService: TodoService,
    private sidebarState: SidebarStateService,
      public language: LanguageService

  ) {}

openMobileMenu(): void {
  this.sidebarState.toggle();
}


  ngOnInit(): void {

    this.loadReportData();

  }



 loadReportData(): void {

    this.isLoading.set(true);


this.hasLoadError.set(false);


    this.todoService
      .getAll()
      .subscribe({

        next: (todos) => {

          this.todos = todos;

          this.calculateStatistics();

          this.createCharts();

          this.isLoading.set(false);

        },

        error: (error) => {

          console.error(
            'Rapor verileri yüklenemedi:',
            error
          );
this.hasLoadError.set(true);
          this.isLoading.set(false);

        }

      });

      
// Raporlar açıldı
//      ↓
// TodoService.getAll()
//      ↓
// SQL Server'daki görevler geldi
//      ↓
// İstatistikleri hesapla
//      ↓
// Grafikleri oluştur




}








// İstatistikleri hesaplayalım

private calculateStatistics(): void {

  this.totalCount =
    this.todos.length;


  this.todoCount =
    this.todos.filter(
      todo =>
        todo.status === TodoStatus.Todo
    ).length;


  this.inProgressCount =
    this.todos.filter(
      todo =>
        todo.status === TodoStatus.InProgress
    ).length;


  this.doneCount =
    this.todos.filter(
      todo =>
        todo.status === TodoStatus.Completed
    ).length;


  this.overdueCount =
    this.todos.filter(
      todo => this.isOverdue(todo)
    ).length;


  this.completionRate =
    this.totalCount === 0
      ? 0
      : Math.round(
          (
            this.doneCount /
            this.totalCount
          ) * 100
        );
}
// Görev tamamlanmışsa veya son tarihi yoksa “gecikmiş” kabul etmez.
private isOverdue(todo: Todo): boolean {
  if (todo.status === TodoStatus.Completed) {
    return false;
  }

  const dueDate =
    this.language.parseDate(todo.dueDate);

  if (!dueDate) {
    return false;
  }

  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return dueDate.getTime() < today.getTime();
}

private createCharts(): void {
  const darkMode =
    document.documentElement.classList.contains('app-dark');

  const textColor = darkMode
    ? '#cbd5e1'
    : '#475569';

  const gridColor = darkMode
    ? '#293952'
    : '#e8edf3';


    const chartLocale = this.language.currentLocale;

    // Şimdi Arapçada grafik açıklamalarının sağdan sola görünmesini sağlayalım.

    const isRtl =
  document.documentElement.dir === 'rtl';

  this.statusChartData = {
   labels: [
  this.language.translate('taskList.todoTitle'),
  this.language.translate('taskList.progressTitle'),
  this.language.translate('taskList.completedTitle')
],
    datasets: [{
      data: [this.todoCount, this.inProgressCount, this.doneCount],
      backgroundColor: ['#94a3b8', '#3b82f6', '#10b981']
    }]
  };

  this.priorityChartData = {
    labels: [
  this.language.translate('priority.low'),
  this.language.translate('priority.medium'),
  this.language.translate('priority.high')
],
    datasets: [{
      data: [
        this.todos.filter(todo => todo.priority === TodoPriority.Low).length,
        this.todos.filter(todo => todo.priority === TodoPriority.Medium).length,
        this.todos.filter(todo => todo.priority === TodoPriority.High).length
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
    }]
  };
 

  // Grafikteki renk açıklamalarını grafiğin altına yerleştirir.
 this.statusChartOptions = {

responsive: true,
  maintainAspectRatio: false,

  locale: chartLocale,

  plugins: {
    legend: {
      position: 'bottom',
      rtl: isRtl,
      textDirection: isRtl ? 'rtl' : 'ltr',

      labels: {
        color: textColor
      }
    },

    tooltip: {
      rtl: isRtl,
      textDirection: isRtl ? 'rtl' : 'ltr'
    }
  }
};
  this.priorityChartOptions = {

    responsive: true,
  maintainAspectRatio: false,
    locale: chartLocale,
    plugins: {
      legend: {
        display: false
      },
       tooltip: {
    rtl: isRtl,
    textDirection: isRtl ? 'rtl' : 'ltr'
  },
    },







    scales: {
      x: {
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: textColor
        },
        grid: {
          color: gridColor
        }
      }
    }
  };
}

}



// calculateStatistics()
//     ├─ Görev sayılarını hesaplar
//     ├─ Geciken görevleri bulur
//     └─ Tamamlanma yüzdesini hesaplar

// createCharts()
//     ├─ Durum grafiğinin verisini hazırlar
//     └─ Öncelik grafiğinin verisini hazırlar
