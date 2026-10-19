import { Injectable, signal } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { getPrimeNgTranslation } from './primeng-translations';

export type AppLanguage = 'tr' | 'en' | 'ar';

const translations: Record<AppLanguage, Record<string, string>> = {
  tr: {



'auth.forgot.title': 'Şifreni sıfırla',
'auth.forgot.subtitle': 'E-posta adresini gir. Şifre sıfırlama bağlantısını sana gönderelim.',
'auth.forgot.emailLabel': 'E-posta',
'auth.forgot.emailPlaceholder': 'E-posta adresin',
'auth.forgot.emailRequired': 'E-posta adresi zorunludur.',
'auth.forgot.emailInvalid': 'Geçerli bir e-posta adresi gir.',
'auth.forgot.submit': 'Bağlantı Gönder',
'auth.forgot.submitting': 'Gönderiliyor...',
'auth.forgot.backToLogin': 'Giriş sayfasına dön',
'auth.forgot.error': 'İstek gönderilemedi. Lütfen tekrar dene.',
'auth.forgot.success': 'Bu e-posta adresi kayıtlıysa sıfırlama bağlantısı gönderildi. Gelen kutunu kontrol et.',
'auth.forgot.notConfigured': 'E-posta servisi henüz ayarlanmadı. Lütfen daha sonra tekrar dene.',
'auth.reset.title': 'Yeni şifre oluştur',
'auth.reset.subtitle': 'Hesabın için güçlü bir şifre belirle.',
'auth.reset.passwordLabel': 'Yeni şifre',
'auth.reset.confirmLabel': 'Yeni şifre tekrarı',
'auth.reset.passwordMinLength': 'Şifre en az 15 karakter olmalıdır.',
'auth.reset.confirmRequired': 'Şifreni tekrar gir.',
'auth.reset.passwordMismatch': 'Şifreler eşleşmiyor.',
'auth.reset.submit': 'Şifreyi değiştir',
'auth.reset.submitting': 'Değiştiriliyor...',
'auth.reset.success': 'Şifren değiştirildi. Artık giriş yapabilirsin.',
'auth.reset.invalidLink': 'Bu sıfırlama bağlantısı eksik veya geçersiz.',
'auth.reset.error': 'Şifre değiştirilemedi. Bağlantının süresi dolmuş olabilir.',
'nav.logout': 'Çıkış yap',

    'auth.register.title': 'Hesabını oluştur',
    'auth.register.subtitle': 'Planlarını düzenlemeye ve hedeflerine ulaşmaya başla.',

    'auth.register.nameLabel': 'Ad Soyad',
    'auth.register.namePlaceholder': 'Adın ve soyadın',
    'auth.register.nameRequired': 'Ad soyad zorunludur.',
    'auth.register.nameMaxLength': 'Ad soyad en fazla {count} karakter olabilir.',

    'auth.register.emailLabel': 'E-posta',
    'auth.register.emailPlaceholder': 'E-posta adresin',
    'auth.register.emailRequired': 'E-posta adresi zorunludur.',
    'auth.register.emailInvalid': 'Geçerli bir e-posta adresi gir.',

    'auth.register.passwordLabel': 'Şifre',
    'auth.register.passwordPlaceholder': 'Yeni bir şifre oluştur',
    'auth.register.passwordRequired': 'Şifre zorunludur.',
    'auth.register.passwordMinLength': 'Şifre en az {count} karakter olmalıdır.',

    'auth.register.confirmPasswordLabel': 'Şifre Tekrarı',
    'auth.register.confirmPasswordPlaceholder': 'Şifreni tekrar gir',
    'auth.register.confirmPasswordRequired': 'Şifreni tekrar gir.',
    'auth.register.passwordMismatch': 'Şifreler birbiriyle eşleşmiyor.',

    'auth.register.showPassword': 'Şifreyi göster',
    'auth.register.hidePassword': 'Şifreyi gizle',

    'auth.register.submit': 'Hesap Oluştur',
    'auth.register.submitting': 'Hesap oluşturuluyor...',
    'auth.register.separator': 'veya',
    'auth.register.alreadyAccount': 'Zaten hesabın var mı?',
    'auth.register.login': 'Giriş Yap',
    'auth.register.error': 'Hesap oluşturulamadı. Lütfen tekrar dene.',

    'auth.languageLabel': 'Dil seçimi',
    'auth.brandSlogan': 'Planlarınla daha fazlasını yap.',
    'auth.brandDescription':
      'Görevlerini düzenle, ilerlemeni takip et ve hedeflerine daha hızlı ulaş.',

    'auth.kanban.todo': 'Yapılacak',
    'auth.kanban.inProgress': 'Devam Ediyor',
    'auth.kanban.completed': 'Tamamlandı',

    'auth.login.title': 'Tekrar hoş geldin',
    'auth.login.subtitle': 'Planlarına kaldığın yerden devam et.',

    'auth.login.emailLabel': 'E-posta',
    'auth.login.emailPlaceholder': 'E-posta adresin',
    'auth.login.emailRequired': 'E-posta adresi zorunludur.',
    'auth.login.emailInvalid': 'Geçerli bir e-posta adresi gir.',

    'auth.login.passwordLabel': 'Şifre',
    'auth.login.passwordPlaceholder': 'Şifren',
    'auth.login.passwordRequired': 'Şifre zorunludur.',

    'auth.login.showPassword': 'Şifreyi göster',
    'auth.login.hidePassword': 'Şifreyi gizle',
    'auth.login.rememberMe': 'Beni hatırla',
    'auth.login.forgotPassword': 'Şifremi unuttum?',
    'auth.login.submit': 'Giriş Yap',
    'auth.login.submitting': 'Giriş yapılıyor...',
    'auth.login.separator': 'veya',
    'auth.login.noAccount': 'Hesabın yok mu?',
    'auth.login.register': 'Kayıt Ol',
    'auth.login.error': 'Giriş yapılamadı. Bilgilerini kontrol edip tekrar dene.',

    'calendar.loading': 'Takvim hazırlanıyor...',
    'calendar.loadError': 'Takvim yüklenemedi.',
    'calendar.retry': 'Tekrar dene',

    'reports.completionRate': 'Tamamlanma Oranı',
    'reports.completionDescription': 'Tüm görevlerin ne kadarını tamamladın?',

    'menu.open': 'Menüyü aç',
    'reports.title': 'Raporlar',
    'reports.subtitle': 'Görev performansını ve genel durumunu takip et.',
    'reports.loading': 'Raporlar hazırlanıyor...',

    'reports.totalTasks': 'Toplam Görev',
    'reports.completed': 'Tamamlanan',
    'reports.inProgress': 'Devam Ediyor',
    'reports.overdue': 'Geciken Görev',

    'reports.loadError': 'Raporlar yüklenemedi.',
    'reports.retry': 'Tekrar dene',

    'reports.statusChartTitle': 'Görev Durumları',
    'reports.statusChartDescription': 'Görevlerin mevcut durum dağılımı',
    'reports.priorityChartTitle': 'Öncelik Dağılımı',
    'reports.priorityChartDescription': 'Görevlerin öncelik seviyelerine göre dağılımı',

    'calendar.noDueDate': 'Son tarih yok',

    'calendar.detailTitle': 'Görev Detayı',
    'calendar.noDescription': 'Bu görev için açıklama eklenmemiş.',
    'calendar.dueDate': 'Son Tarih',
    'calendar.createdAt': 'Oluşturulma',
    'calendar.close': 'Kapat',

    'taskMessage.success': 'Başarılı',
    'taskMessage.updateSuccess': 'Görev başarıyla güncellendi.',
    'taskMessage.updateError': 'Görev güncellenemedi.',
    'taskMessage.loadError': 'Görevler yüklenemedi. Lütfen tekrar deneyin.',

    'taskMessage.createdTitle': 'Görev Oluşturuldu',
    'taskMessage.createdDetail': '"{title}" başarıyla oluşturuldu.',

    'taskMessage.deleteTitle': 'Görevi Sil',
    'taskMessage.deleteConfirm': '"{title}" görevini silmek istediğinize emin misiniz?',
    'taskMessage.deleteSuccess': 'Görev başarıyla silindi.',
    'taskMessage.deleteError': 'Görev silinirken bir hata oluştu.',

    'taskMessage.statusUpdatedTitle': 'Durum Güncellendi',
    'taskMessage.statusUpdatedDetail': 'Görev "{status}" durumuna taşındı.',
    'taskMessage.statusUpdateError': 'Görev taşınırken bir hata oluştu.',

    'notification.title': 'Bildirimler',
    'notification.ariaLabel': 'Bildirimler: {count} okunmamış',
    'notification.listLabel': 'Bildirim listesi',
    'notification.empty': 'Yeni bildiriminiz yok.',
    'notification.dismissLabel': '{title} bildirimini kaldır',

    'notification.overdue': 'Bu görevin son tarihi geçti.',
    'notification.today': 'Bu görevin son tarihi bugün.',
    'notification.tomorrow': 'Bu görevin son tarihi yarın.',
    'notification.daysRemaining': 'Son tarihe {count} gün kaldı.',

    'settings.title': 'Ayarlar',
    'settings.subtitle': 'Uygulama deneyimini kendine göre özelleştir.',

    'language.title': 'Dil',
    'language.description': 'Uygulamanın görüntüleneceği dili seç.',

    'appearance.title': 'Görünüm',
    'appearance.description': 'Uygulamanın temasını seç.',
    'theme.light': 'Açık',
    'theme.dark': 'Koyu',

    'tasks.title': 'Görev Tercihleri',
    'tasks.description': 'Yeni görevler için varsayılan seçenekleri belirle.',

    'priority.title': 'Varsayılan Öncelik',
    'priority.description': 'Yeni görev oluştururken başlangıç önceliği.',
    'priority.low': 'Düşük',
    'priority.medium': 'Orta',
    'priority.high': 'Yüksek',

    'notifications.title': 'Görev Bildirimleri',
    'notifications.description': 'Yaklaşan görevler için bildirimleri etkinleştir.',

    'profile.title': 'Profil',
    'profile.description': 'Hesap bilgilerin.',
    'profile.emailReadOnly': 'E-posta adresi şimdilik değiştirilemez.',
    'profile.save': 'Profili kaydet',
    'profile.saving': 'Kaydediliyor...',
    'profile.saved': 'Profilin güncellendi.',
    'profile.saveError': 'Profil kaydedilemedi. Lütfen tekrar dene.',
    'profile.passwordTitle': 'Şifre değiştir',
    'profile.passwordDescription': 'Mevcut şifreni kullanarak yeni bir şifre belirle.',
    'profile.currentPassword': 'Mevcut şifre',
    'profile.passwordNotice': 'Yeni şifren en az 15 karakter olmalı. Değişiklikten sonra tüm oturumlarında yeniden giriş yapman gerekecek.',
    'profile.wrongPassword': 'Mevcut şifren yanlış. Kontrol edip tekrar dene.',
    'profile.passwordError': 'Şifre değiştirilemedi. Lütfen tekrar dene.',
    'profile.tooManyAttempts': 'Çok fazla deneme yaptın. Bir dakika sonra tekrar dene.',
    'profile.passwordChanged': 'Şifren değiştirildi. Yeni şifrenle yeniden giriş yap.',
    'profile.unavailable': 'Hesap bilgileri henüz yüklenmedi.',
    'profile.reload': 'Bilgileri yeniden yükle',
    'profile.loadError': 'Hesap bilgileri yüklenemedi. Lütfen tekrar dene.',
    'profile.showPasswords': 'Şifreleri göster',
    'profile.hidePasswords': 'Şifreleri gizle',

    'settings.save': 'Ayarları Kaydet',
    'settings.saved': 'Kaydedildi',
    'settings.savedMessage': 'Ayarlarınız başarıyla kaydedildi.',

    'nav.tasks': 'Görevler',
    'nav.calendar': 'Takvim',
    'nav.reports': 'Raporlar',
    'nav.settings': 'Ayarlar',
    'user.name': 'Kullanıcı',
    'menu.close': 'Menüyü kapat',

    'todoForm.newTask': 'Yeni Görev',
    'todoForm.dialogTitle': 'Yeni Görev Oluştur',
    'todoForm.title': 'Görev Başlığı',
    'todoForm.titlePlaceholder': 'Örn: Dashboard tasarımını tamamla',
    'todoForm.titleRequired': 'Görev başlığı zorunludur.',
    'todoForm.titleMinLength': 'Başlık en az 3 karakter olmalıdır.',
    'todoForm.titleMaxLength': 'Başlık en fazla 100 karakter olabilir.',
    'todoForm.titleHelper': '3–100 karakter',
    'todoForm.description': 'Açıklama',
    'todoForm.descriptionPlaceholder': 'Görev hakkında kısa bir açıklama yaz',
    'todoForm.descriptionMaxLength': 'Açıklama en fazla 500 karakter olabilir.',
    'todoForm.descriptionHelper': 'İsteğe bağlı, en fazla 500 karakter',
    'todoForm.priority': 'Öncelik',
    'todoForm.priorityPlaceholder': 'Öncelik seç',
    'todoForm.dueDate': 'Son Tarih',
    'todoForm.dueDatePlaceholder': 'Son tarih seç',
    'todoForm.cancel': 'İptal',
    'todoForm.create': 'Görev Oluştur',
    'todoForm.error': 'Hata',
    'todoForm.createError': 'Görev oluşturulamadı. Lütfen tekrar deneyin.',

    'taskList.title': 'Görev Yönetimi',
    'taskList.subtitle': 'Gününü yönet, geleceğini gör.',
    'taskList.searchPlaceholder': 'Görev ara...',
    'taskList.allPriorities': 'Tüm Öncelikler',
    'taskList.allStatuses': 'Tüm Durumlar',

    'taskList.todoTitle': 'Yapılacak',
    'taskList.todoDescription': 'Bekleyen görevler',
    'taskList.progressTitle': 'Devam Ediyor',
    'taskList.progressDescription': 'Üzerinde çalışılan görevler',
    'taskList.completedTitle': 'Tamamlandı',
    'taskList.completedDescription': 'Tamamlanan görevler',

    'taskList.empty': 'Henüz görev yok',
    'taskList.emptyCompleted': 'Henüz tamamlanan görev yok',
    'taskList.edit': 'Düzenle',
    'taskList.delete': 'Sil',

    'todoEdit.dialogTitle': 'Görevi Düzenle',
    'todoEdit.status': 'Durum',
    'todoEdit.statusPlaceholder': 'Durum seç',
    'todoEdit.save': 'Değişiklikleri Kaydet',

    'calendar.title': 'Takvim',
    'calendar.subtitle': 'Görevlerini zamanında yap.',
    'calendar.today': 'Bugün',
    'calendar.openMenu': 'Menüyü aç',
    'calendar.previousMonth': 'Önceki ay',
    'calendar.nextMonth': 'Sonraki ay',

    'calendar.weekday.monday': 'Pzt',
    'calendar.weekday.tuesday': 'Sal',
    'calendar.weekday.wednesday': 'Çar',
    'calendar.weekday.thursday': 'Per',
    'calendar.weekday.friday': 'Cum',
    'calendar.weekday.saturday': 'Cmt',
    'calendar.weekday.sunday': 'Paz',
  },

  en: {

'nav.logout': 'Log out',
'auth.forgot.title': 'Reset your password',
'auth.forgot.subtitle': 'Enter your email address and we’ll send you a password reset link.',
'auth.forgot.emailLabel': 'Email',
'auth.forgot.emailPlaceholder': 'Your email address',
'auth.forgot.emailRequired': 'Email address is required.',
'auth.forgot.emailInvalid': 'Enter a valid email address.',
'auth.forgot.submit': 'Send Reset Link',
'auth.forgot.submitting': 'Sending...',
'auth.forgot.backToLogin': 'Back to sign in',
'auth.forgot.error': 'Could not send the request. Please try again.',
'auth.forgot.success': 'If this address has an account, a reset link has been sent. Check your inbox.',
'auth.forgot.notConfigured': 'Email delivery is not configured yet. Please try again later.',
'auth.reset.title': 'Create a new password',
'auth.reset.subtitle': 'Choose a strong password for your account.',
'auth.reset.passwordLabel': 'New password',
'auth.reset.confirmLabel': 'Confirm new password',
'auth.reset.passwordMinLength': 'Password must be at least 15 characters.',
'auth.reset.confirmRequired': 'Confirm your password.',
'auth.reset.passwordMismatch': 'Passwords do not match.',
'auth.reset.submit': 'Change password',
'auth.reset.submitting': 'Changing...',
'auth.reset.success': 'Your password has changed. You can now sign in.',
'auth.reset.invalidLink': 'This reset link is incomplete or invalid.',
'auth.reset.error': 'Password could not be changed. The link may have expired.',





    'auth.register.title': 'Create your account',
    'auth.register.subtitle': 'Start organizing your plans and reaching your goals.',

    'auth.register.nameLabel': 'Full Name',
    'auth.register.namePlaceholder': 'Your full name',
    'auth.register.nameRequired': 'Full name is required.',
    'auth.register.nameMaxLength': 'Full name must not exceed {count} characters.',

    'auth.register.emailLabel': 'Email',
    'auth.register.emailPlaceholder': 'Your email address',
    'auth.register.emailRequired': 'Email address is required.',
    'auth.register.emailInvalid': 'Enter a valid email address.',

    'auth.register.passwordLabel': 'Password',
    'auth.register.passwordPlaceholder': 'Create a new password',
    'auth.register.passwordRequired': 'Password is required.',
    'auth.register.passwordMinLength': 'Password must contain at least {count} characters.',

    'auth.register.confirmPasswordLabel': 'Confirm Password',
    'auth.register.confirmPasswordPlaceholder': 'Enter your password again',
    'auth.register.confirmPasswordRequired': 'Enter your password again.',
    'auth.register.passwordMismatch': 'The passwords do not match.',

    'auth.register.showPassword': 'Show password',
    'auth.register.hidePassword': 'Hide password',

    'auth.register.submit': 'Create Account',
    'auth.register.submitting': 'Creating account...',
    'auth.register.separator': 'or',
    'auth.register.alreadyAccount': 'Already have an account?',
    'auth.register.login': 'Sign In',
    'auth.register.error': 'Your account could not be created. Please try again.',

    'auth.languageLabel': 'Language selection',
    'auth.brandSlogan': 'Do more with your plans.',
    'auth.brandDescription':
      'Organize your tasks, track your progress, and reach your goals faster.',

    'auth.kanban.todo': 'To Do',
    'auth.kanban.inProgress': 'In Progress',
    'auth.kanban.completed': 'Completed',
    'auth.login.title': 'Welcome back',
    'auth.login.subtitle': 'Continue your plans from where you left off.',

    'auth.login.emailLabel': 'Email',
    'auth.login.emailPlaceholder': 'Your email address',
    'auth.login.emailRequired': 'Email address is required.',
    'auth.login.emailInvalid': 'Enter a valid email address.',

    'auth.login.passwordLabel': 'Password',
    'auth.login.passwordPlaceholder': 'Your password',
    'auth.login.passwordRequired': 'Password is required.',

    'auth.login.showPassword': 'Show password',
    'auth.login.hidePassword': 'Hide password',
    'auth.login.rememberMe': 'Remember me',
    'auth.login.forgotPassword': 'Forgot password?',
    'auth.login.submit': 'Sign In',
    'auth.login.submitting': 'Signing in...',
    'auth.login.separator': 'or',
    'auth.login.noAccount': "Don't have an account?",
    'auth.login.register': 'Create Account',
    'auth.login.error': 'Sign in failed. Check your information and try again.',

    'calendar.loading': 'Preparing calendar...',
    'calendar.loadError': 'Calendar could not be loaded.',
    'calendar.retry': 'Try again',

    'reports.completionRate': 'Completion Rate',
    'reports.completionDescription': 'How many of all your tasks have you completed?',

    'reports.statusChartTitle': 'Task Statuses',
    'reports.statusChartDescription': 'Current status distribution of tasks',
    'reports.priorityChartTitle': 'Priority Distribution',
    'reports.priorityChartDescription': 'Distribution of tasks by priority level',

    'calendar.detailTitle': 'Task Details',
    'calendar.noDescription': 'No description has been added for this task.',
    'calendar.dueDate': 'Due Date',
    'calendar.createdAt': 'Created',
    'calendar.close': 'Close',

    'calendar.noDueDate': 'No due date',

    'taskMessage.success': 'Success',
    'taskMessage.updateSuccess': 'The task was updated successfully.',
    'taskMessage.updateError': 'The task could not be updated.',
    'taskMessage.loadError': 'Tasks could not be loaded. Please try again.',

    'taskMessage.createdTitle': 'Task Created',
    'taskMessage.createdDetail': '"{title}" was created successfully.',

    'taskMessage.deleteTitle': 'Delete Task',
    'taskMessage.deleteConfirm': 'Are you sure you want to delete the task "{title}"?',
    'taskMessage.deleteSuccess': 'The task was deleted successfully.',
    'taskMessage.deleteError': 'An error occurred while deleting the task.',

    'taskMessage.statusUpdatedTitle': 'Status Updated',
    'taskMessage.statusUpdatedDetail': 'The task was moved to "{status}".',
    'taskMessage.statusUpdateError': 'An error occurred while moving the task.',

    'reports.totalTasks': 'Total Tasks',
    'reports.completed': 'Completed',
    'reports.inProgress': 'In Progress',
    'reports.overdue': 'Overdue Tasks',

    'calendar.title': 'Calendar',
    'calendar.subtitle': 'Complete your tasks on time.',
    'calendar.today': 'Today',
    'calendar.openMenu': 'Open menu',
    'calendar.previousMonth': 'Previous month',
    'calendar.nextMonth': 'Next month',

    'calendar.weekday.monday': 'Mon',
    'calendar.weekday.tuesday': 'Tue',
    'calendar.weekday.wednesday': 'Wed',
    'calendar.weekday.thursday': 'Thu',
    'calendar.weekday.friday': 'Fri',
    'calendar.weekday.saturday': 'Sat',
    'calendar.weekday.sunday': 'Sun',

    'menu.open': 'Open menu',
    'reports.title': 'Reports',
    'reports.subtitle': 'Track your task performance and overall status.',
    'reports.loading': 'Preparing reports...',

    'notification.title': 'Notifications',
    'notification.ariaLabel': 'Notifications: {count} unread',
    'notification.listLabel': 'Notification list',
    'notification.empty': 'You have no new notifications.',
    'notification.dismissLabel': 'Dismiss the {title} notification',

    'notification.overdue': 'This task is overdue.',
    'notification.today': 'This task is due today.',
    'notification.tomorrow': 'This task is due tomorrow.',
    'notification.daysRemaining': '{count} days remaining until the due date.',

    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your application experience.',

    'language.title': 'Language',
    'language.description': 'Select the language of the application.',

    'appearance.title': 'Appearance',
    'appearance.description': 'Select the application theme.',
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    'tasks.title': 'Task Preferences',
    'tasks.description': 'Set the default options for new tasks.',

    'priority.title': 'Default Priority',
    'priority.description': 'Initial priority when creating a new task.',
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',

    'notifications.title': 'Task Notifications',
    'notifications.description': 'Enable notifications for upcoming tasks.',

    'profile.title': 'Profile',
    'profile.description': 'Your account information.',
    'profile.emailReadOnly': 'Your email address cannot be changed yet.',
    'profile.save': 'Save profile',
    'profile.saving': 'Saving...',
    'profile.saved': 'Your profile has been updated.',
    'profile.saveError': 'Your profile could not be saved. Please try again.',
    'profile.passwordTitle': 'Change password',
    'profile.passwordDescription': 'Use your current password to set a new one.',
    'profile.currentPassword': 'Current password',
    'profile.passwordNotice': 'Your new password must be at least 15 characters. You will need to sign in again on all your sessions after changing it.',
    'profile.wrongPassword': 'Your current password is incorrect. Please check and try again.',
    'profile.passwordError': 'Your password could not be changed. Please try again.',
    'profile.tooManyAttempts': 'Too many attempts. Please try again in one minute.',
    'profile.passwordChanged': 'Your password has been changed. Sign in again with your new password.',
    'profile.unavailable': 'Your account information has not loaded yet.',
    'profile.reload': 'Reload account details',
    'profile.loadError': 'Your account details could not be loaded. Please try again.',
    'profile.showPasswords': 'Show passwords',
    'profile.hidePasswords': 'Hide passwords',

    'settings.save': 'Save Settings',
    'settings.saved': 'Saved',
    'settings.savedMessage': 'Your settings have been saved successfully.',

    'nav.tasks': 'Tasks',
    'nav.calendar': 'Calendar',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'user.name': 'User',
    'menu.close': 'Close menu',

    'todoForm.newTask': 'New Task',
    'todoForm.dialogTitle': 'Create New Task',
    'todoForm.title': 'Task Title',
    'todoForm.titlePlaceholder': 'Example: Complete the dashboard design',
    'todoForm.titleRequired': 'Task title is required.',
    'todoForm.titleMinLength': 'The title must contain at least 3 characters.',
    'todoForm.titleMaxLength': 'The title can contain up to 100 characters.',
    'todoForm.titleHelper': '3–100 characters',
    'todoForm.description': 'Description',
    'todoForm.descriptionPlaceholder': 'Write a short description of the task',
    'todoForm.descriptionMaxLength': 'The description can contain up to 500 characters.',
    'todoForm.descriptionHelper': 'Optional, up to 500 characters',
    'todoForm.priority': 'Priority',
    'todoForm.priorityPlaceholder': 'Select priority',
    'todoForm.dueDate': 'Due Date',
    'todoForm.dueDatePlaceholder': 'Select due date',
    'todoForm.cancel': 'Cancel',
    'todoForm.create': 'Create Task',
    'todoForm.error': 'Error',
    'todoForm.createError': 'The task could not be created. Please try again.',

    'taskList.title': 'Task Management',
    'taskList.subtitle': 'Manage your day, see your future.',
    'taskList.searchPlaceholder': 'Search tasks...',
    'taskList.allPriorities': 'All Priorities',
    'taskList.allStatuses': 'All Statuses',

    'taskList.todoTitle': 'To Do',
    'taskList.todoDescription': 'Pending tasks',
    'taskList.progressTitle': 'In Progress',
    'taskList.progressDescription': 'Tasks in progress',
    'taskList.completedTitle': 'Completed',
    'taskList.completedDescription': 'Completed tasks',

    'taskList.empty': 'No tasks yet',
    'taskList.emptyCompleted': 'No completed tasks yet',
    'taskList.edit': 'Edit',
    'taskList.delete': 'Delete',

    'reports.loadError': 'Reports could not be loaded.',
    'reports.retry': 'Try again',

    'todoEdit.dialogTitle': 'Edit Task',
    'todoEdit.status': 'Status',
    'todoEdit.statusPlaceholder': 'Select status',
    'todoEdit.save': 'Save Changes',
  },

  ar: {



    'auth.forgot.title': 'إعادة تعيين كلمة المرور',
'auth.forgot.subtitle': 'أدخل بريدك الإلكتروني وسنرسل إليك رابط إعادة تعيين كلمة المرور.',
'auth.forgot.emailLabel': 'البريد الإلكتروني',
'auth.forgot.emailPlaceholder': 'أدخل بريدك الإلكتروني',
'auth.forgot.emailRequired': 'البريد الإلكتروني مطلوب.',
'auth.forgot.emailInvalid': 'أدخل بريدًا إلكترونيًا صالحًا.',
'auth.forgot.submit': 'إرسال الرابط',
'auth.forgot.submitting': 'جارٍ الإرسال...',
'auth.forgot.backToLogin': 'العودة إلى تسجيل الدخول',
'auth.forgot.error': 'تعذر إرسال الطلب. حاول مرة أخرى.',
'auth.forgot.success': 'إذا كان لهذا البريد حساب، فقد أُرسل رابط إعادة التعيين. تحقق من بريدك.',
'auth.forgot.notConfigured': 'خدمة البريد الإلكتروني غير مُعدّة بعد. حاول مرة أخرى لاحقًا.',
'auth.reset.title': 'إنشاء كلمة مرور جديدة',
'auth.reset.subtitle': 'اختر كلمة مرور قوية لحسابك.',
'auth.reset.passwordLabel': 'كلمة المرور الجديدة',
'auth.reset.confirmLabel': 'تأكيد كلمة المرور الجديدة',
'auth.reset.passwordMinLength': 'يجب أن تتكون كلمة المرور من 15 حرفًا على الأقل.',
'auth.reset.confirmRequired': 'أكّد كلمة المرور.',
'auth.reset.passwordMismatch': 'كلمتا المرور غير متطابقتين.',
'auth.reset.submit': 'تغيير كلمة المرور',
'auth.reset.submitting': 'جارٍ التغيير...',
'auth.reset.success': 'تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.',
'auth.reset.invalidLink': 'رابط إعادة التعيين غير مكتمل أو غير صالح.',
'auth.reset.error': 'تعذر تغيير كلمة المرور. ربما انتهت صلاحية الرابط.',
'nav.logout': 'تسجيل الخروج',

    'auth.register.title': 'أنشئ حسابك',
    'auth.register.subtitle': 'ابدأ بتنظيم خططك وتحقيق أهدافك.',

    'auth.register.nameLabel': 'الاسم الكامل',
    'auth.register.namePlaceholder': 'أدخل اسمك الكامل',
    'auth.register.nameRequired': 'الاسم الكامل مطلوب.',
    'auth.register.nameMaxLength': 'يجب ألا يتجاوز الاسم الكامل {count} حرفًا.',

    'auth.register.emailLabel': 'البريد الإلكتروني',
    'auth.register.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'auth.register.emailRequired': 'البريد الإلكتروني مطلوب.',
    'auth.register.emailInvalid': 'أدخل بريدًا إلكترونيًا صالحًا.',

    'auth.register.passwordLabel': 'كلمة المرور',
    'auth.register.passwordPlaceholder': 'أنشئ كلمة مرور جديدة',
    'auth.register.passwordRequired': 'كلمة المرور مطلوبة.',
    'auth.register.passwordMinLength': 'يجب أن تتكون كلمة المرور من {count} أحرف على الأقل.',

    'auth.register.confirmPasswordLabel': 'تأكيد كلمة المرور',
    'auth.register.confirmPasswordPlaceholder': 'أعد إدخال كلمة المرور',
    'auth.register.confirmPasswordRequired': 'أعد إدخال كلمة المرور.',
    'auth.register.passwordMismatch': 'كلمتا المرور غير متطابقتين.',

    'auth.register.showPassword': 'إظهار كلمة المرور',
    'auth.register.hidePassword': 'إخفاء كلمة المرور',

    'auth.register.submit': 'إنشاء حساب',
    'auth.register.submitting': 'جارٍ إنشاء الحساب...',
    'auth.register.separator': 'أو',
    'auth.register.alreadyAccount': 'لديك حساب بالفعل؟',
    'auth.register.login': 'تسجيل الدخول',
    'auth.register.error': 'تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.',

    'auth.languageLabel': 'اختيار اللغة',
    'auth.brandSlogan': 'خطّط أكثر، وأنجز أكثر.',
    'auth.brandDescription': 'نظّم مهامك، وتابع تقدّمك، وحقّق أهدافك بسرعة أكبر.',

    'auth.kanban.todo': 'للقيام',
    'auth.kanban.inProgress': 'قيد التنفيذ',
    'auth.kanban.completed': 'مكتمل',

    'auth.login.title': 'مرحبًا بعودتك',
    'auth.login.subtitle': 'تابع خططك من حيث توقفت.',

    'auth.login.emailLabel': 'البريد الإلكتروني',
    'auth.login.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'auth.login.emailRequired': 'البريد الإلكتروني مطلوب.',
    'auth.login.emailInvalid': 'أدخل بريدًا إلكترونيًا صالحًا.',

    'auth.login.passwordLabel': 'كلمة المرور',
    'auth.login.passwordPlaceholder': 'أدخل كلمة المرور',
    'auth.login.passwordRequired': 'كلمة المرور مطلوبة.',

    'auth.login.showPassword': 'إظهار كلمة المرور',
    'auth.login.hidePassword': 'إخفاء كلمة المرور',
    'auth.login.rememberMe': 'تذكرني',
    'auth.login.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.login.submit': 'تسجيل الدخول',
    'auth.login.submitting': 'جارٍ تسجيل الدخول...',
    'auth.login.separator': 'أو',
    'auth.login.noAccount': 'ليس لديك حساب؟',
    'auth.login.register': 'إنشاء حساب',
    'auth.login.error': 'تعذر تسجيل الدخول. تحقق من معلوماتك وحاول مرة أخرى.',

    'reports.statusChartTitle': 'حالات المهام',
    'reports.statusChartDescription': 'توزيع الحالات الحالية للمهام',
    'reports.priorityChartTitle': 'توزيع الأولويات',
    'reports.priorityChartDescription': 'توزيع المهام حسب مستوى الأولوية',

    'reports.loadError': 'تعذر تحميل التقارير.',
    'reports.retry': 'إعادة المحاولة',

    'reports.completionRate': 'معدل الإنجاز',
    'reports.completionDescription': 'ما النسبة التي أكملتها من جميع المهام؟',

    'calendar.loading': 'جارٍ إعداد التقويم...',
    'calendar.loadError': 'تعذر تحميل التقويم.',
    'calendar.retry': 'إعادة المحاولة',

    'calendar.detailTitle': 'تفاصيل المهمة',
    'calendar.noDescription': 'لم تتم إضافة وصف لهذه المهمة.',
    'calendar.dueDate': 'تاريخ الاستحقاق',
    'calendar.createdAt': 'تاريخ الإنشاء',
    'calendar.close': 'إغلاق',

    'calendar.noDueDate': 'لا يوجد تاريخ استحقاق',

    'taskMessage.success': 'نجاح',
    'taskMessage.updateSuccess': 'تم تحديث المهمة بنجاح.',
    'taskMessage.updateError': 'تعذر تحديث المهمة.',
    'taskMessage.loadError': 'تعذر تحميل المهام. يرجى المحاولة مرة أخرى.',

    'taskMessage.createdTitle': 'تم إنشاء المهمة',
    'taskMessage.createdDetail': 'تم إنشاء "{title}" بنجاح.',

    'taskMessage.deleteTitle': 'حذف المهمة',
    'taskMessage.deleteConfirm': 'هل أنت متأكد أنك تريد حذف المهمة "{title}"؟',
    'taskMessage.deleteSuccess': 'تم حذف المهمة بنجاح.',
    'taskMessage.deleteError': 'حدث خطأ أثناء حذف المهمة.',

    'taskMessage.statusUpdatedTitle': 'تم تحديث الحالة',
    'taskMessage.statusUpdatedDetail': 'تم نقل المهمة إلى حالة "{status}".',
    'taskMessage.statusUpdateError': 'حدث خطأ أثناء نقل المهمة.',

    'menu.open': 'فتح القائمة',
    'reports.title': 'التقارير',
    'reports.subtitle': 'تابع أداء مهامك وحالتها العامة.',
    'reports.loading': 'جارٍ إعداد التقارير...',

    'reports.totalTasks': 'إجمالي المهام',
    'reports.completed': 'المكتملة',
    'reports.inProgress': 'قيد التنفيذ',
    'reports.overdue': 'المهام المتأخرة',

    'calendar.title': 'التقويم',
    'calendar.subtitle': 'أنجز مهامك في الوقت المحدد.',
    'calendar.today': 'اليوم',
    'calendar.openMenu': 'فتح القائمة',
    'calendar.previousMonth': 'الشهر السابق',
    'calendar.nextMonth': 'الشهر التالي',

    'calendar.weekday.monday': 'اثن',
    'calendar.weekday.tuesday': 'ثلا',
    'calendar.weekday.wednesday': 'أرب',
    'calendar.weekday.thursday': 'خمي',
    'calendar.weekday.friday': 'جمع',
    'calendar.weekday.saturday': 'سبت',
    'calendar.weekday.sunday': 'أحد',

    // Bildirimler

    'notification.title': 'الإشعارات',
    'notification.ariaLabel': 'الإشعارات: {count} غير مقروءة',
    'notification.listLabel': 'قائمة الإشعارات',
    'notification.empty': 'لا توجد إشعارات جديدة.',
    'notification.dismissLabel': 'إزالة إشعار {title}',

    'notification.overdue': 'انتهى الموعد النهائي لهذه المهمة.',
    'notification.today': 'الموعد النهائي لهذه المهمة اليوم.',
    'notification.tomorrow': 'الموعد النهائي لهذه المهمة غدًا.',
    'notification.daysRemaining': 'متبقي {count} أيام على الموعد النهائي.',

    'settings.title': 'الإعدادات',
    'settings.subtitle': 'خصص تجربة استخدام التطبيق.',

    'language.title': 'اللغة',
    'language.description': 'اختر لغة عرض التطبيق.',

    'appearance.title': 'المظهر',
    'appearance.description': 'اختر مظهر التطبيق.',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',

    'tasks.title': 'تفضيلات المهام',
    'tasks.description': 'حدد الخيارات الافتراضية للمهام الجديدة.',

    'priority.title': 'الأولوية الافتراضية',
    'priority.description': 'الأولوية الأولية عند إنشاء مهمة جديدة.',
    'priority.low': 'منخفضة',
    'priority.medium': 'متوسطة',
    'priority.high': 'عالية',

    'notifications.title': 'إشعارات المهام',
    'notifications.description': 'فعّل إشعارات المهام القادمة.',

    'profile.title': 'الملف الشخصي',
    'profile.description': 'معلومات حسابك.',
    'profile.emailReadOnly': 'لا يمكن تغيير عنوان البريد الإلكتروني حاليًا.',
    'profile.save': 'حفظ الملف الشخصي',
    'profile.saving': 'جارٍ الحفظ...',
    'profile.saved': 'تم تحديث ملفك الشخصي.',
    'profile.saveError': 'تعذر حفظ الملف الشخصي. يرجى المحاولة مرة أخرى.',
    'profile.passwordTitle': 'تغيير كلمة المرور',
    'profile.passwordDescription': 'استخدم كلمة مرورك الحالية لتعيين كلمة مرور جديدة.',
    'profile.currentPassword': 'كلمة المرور الحالية',
    'profile.passwordNotice': 'يجب أن تتكون كلمة المرور الجديدة من 15 حرفًا على الأقل. بعد تغييرها، ستحتاج إلى تسجيل الدخول من جديد في جميع جلساتك.',
    'profile.wrongPassword': 'كلمة المرور الحالية غير صحيحة. تحقق منها وحاول مرة أخرى.',
    'profile.passwordError': 'تعذر تغيير كلمة المرور. يرجى المحاولة مرة أخرى.',
    'profile.tooManyAttempts': 'محاولات كثيرة جدًا. يرجى المحاولة مجددًا بعد دقيقة.',
    'profile.passwordChanged': 'تم تغيير كلمة المرور. سجّل الدخول مجددًا باستخدام كلمة المرور الجديدة.',
    'profile.unavailable': 'لم يتم تحميل معلومات الحساب بعد.',
    'profile.reload': 'إعادة تحميل معلومات الحساب',
    'profile.loadError': 'تعذر تحميل معلومات الحساب. يرجى المحاولة مرة أخرى.',
    'profile.showPasswords': 'إظهار كلمات المرور',
    'profile.hidePasswords': 'إخفاء كلمات المرور',

    'settings.save': 'حفظ الإعدادات',
    'settings.saved': 'تم الحفظ',
    'settings.savedMessage': 'تم حفظ إعداداتك بنجاح.',

    'nav.tasks': 'المهام',
    'nav.calendar': 'التقويم',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'user.name': 'المستخدم',
    'menu.close': 'إغلاق القائمة',

    'todoForm.newTask': 'مهمة جديدة',
    'todoForm.dialogTitle': 'إنشاء مهمة جديدة',
    'todoForm.title': 'عنوان المهمة',
    'todoForm.titlePlaceholder': 'مثال: أكمل تصميم لوحة التحكم',
    'todoForm.titleRequired': 'عنوان المهمة مطلوب.',
    'todoForm.titleMinLength': 'يجب أن يتكون العنوان من 3 أحرف على الأقل.',
    'todoForm.titleMaxLength': 'يمكن أن يتكون العنوان من 100 حرف كحد أقصى.',
    'todoForm.titleHelper': 'من 3 إلى 100 حرف',
    'todoForm.description': 'الوصف',
    'todoForm.descriptionPlaceholder': 'اكتب وصفًا قصيرًا للمهمة',
    'todoForm.descriptionMaxLength': 'يمكن أن يتكون الوصف من 500 حرف كحد أقصى.',
    'todoForm.descriptionHelper': 'اختياري، 500 حرف كحد أقصى',
    'todoForm.priority': 'الأولوية',
    'todoForm.priorityPlaceholder': 'اختر الأولوية',
    'todoForm.dueDate': 'تاريخ الاستحقاق',
    'todoForm.dueDatePlaceholder': 'اختر تاريخ الاستحقاق',
    'todoForm.cancel': 'إلغاء',
    'todoForm.create': 'إنشاء المهمة',
    'todoForm.error': 'خطأ',
    'todoForm.createError': 'تعذر إنشاء المهمة. يرجى المحاولة مرة أخرى.',

    'taskList.title': 'إدارة المهام',
    'taskList.subtitle': 'نظّم يومك، وشاهد مستقبلك.',
    'taskList.searchPlaceholder': 'ابحث عن مهمة...',
    'taskList.allPriorities': 'جميع الأولويات',
    'taskList.allStatuses': 'جميع الحالات',

    'taskList.todoTitle': 'للقيام',
    'taskList.todoDescription': 'المهام المعلّقة',
    'taskList.progressTitle': 'قيد التنفيذ',
    'taskList.progressDescription': 'المهام الجاري تنفيذها',
    'taskList.completedTitle': 'مكتملة',
    'taskList.completedDescription': 'المهام المكتملة',

    'taskList.empty': 'لا توجد مهام بعد',
    'taskList.emptyCompleted': 'لا توجد مهام مكتملة بعد',
    'taskList.edit': 'تعديل',
    'taskList.delete': 'حذف',

    'todoEdit.dialogTitle': 'تعديل المهمة',
    'todoEdit.status': 'الحالة',
    'todoEdit.statusPlaceholder': 'اختر الحالة',
    'todoEdit.save': 'حفظ التغييرات',
  },
};

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private readonly primeNG: PrimeNG) {
    this.applyLanguage(this.currentLanguage());
  }

  // Seçili dilin tarih, metin ve arama işlemlerinde kullanılacak bölge kodunu verir.
  get currentLocale(): string {
    switch (this.currentLanguage()) {
      case 'en':
        return 'en-US';

      case 'ar':
        return 'ar-SA';

      case 'tr':
      default:
        return 'tr-TR';
    }
  }

  // PrimeNG tarih seçicisinin giriş biçimini seçili dile göre belirler.
  get datePickerFormat(): string {
    switch (this.currentLanguage()) {
      case 'en':
        return 'mm/dd/yy';

      case 'ar':
        return 'dd/mm/yy';

      case 'tr':
      default:
        return 'dd.mm.yy';
    }
  }

  // API'den gelen tarihi güvenli şekilde Date nesnesine dönüştürür.
  parseDate(value: string | Date | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
    }

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (dateOnlyMatch) {
      const year = Number(dateOnlyMatch[1]);
      const month = Number(dateOnlyMatch[2]);
      const day = Number(dateOnlyMatch[3]);

      const date = new Date(year, month - 1, day);

      const isValid =
        date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

      return isValid ? date : null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Tarihi seçili dilin kurallarına göre kullanıcıya gösterir.
  formatDate(value: string | Date | null | undefined): string {
    const date = this.parseDate(value);

    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat(this.currentLocale, {
      dateStyle: 'short',
      calendar: 'gregory',
    }).format(date);
  }

  // Sayıları seçilen dile göre biçimlendirir.
  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.currentLocale, {
      useGrouping: false,
    }).format(value);
  }

  // Yüzde değerini seçilen dile göre biçimlendirir.
  formatPercent(value: number): string {
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'percent',
      maximumFractionDigits: 0,
    }).format(value / 100);
  }

  //completionRate
  //     ↓
  //      75
  //       ↓
  // formatPercent(75)
  //       ↓
  // Türkçe: %75
  // İngilizce: 75%
  // Arapça: ٧٥٪

  // suan hangi dil secii onu tutar
  currentLanguage = signal<AppLanguage>(this.loadLanguage());

  // Seçilen dili değiştirir ve tarayıcıya kaydeder.
  setLanguage(language: AppLanguage): void {
    this.currentLanguage.set(language);

    localStorage.setItem('language', language);

    this.applyLanguage(language);
  }

  // Çeviriyi getirir ve {count}, {title} gibi değişkenleri yerleştirir.
  translate(key: string, params: Record<string, string | number> = {}): string {
    let text = translations[this.currentLanguage()][key] ?? translations.tr[key] ?? key;

    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }

    return text;
  }

  // Tarayıcıda daha önce kaydedilen dili getirir.
  private loadLanguage(): AppLanguage {
    const savedLanguage = localStorage.getItem('language');

    if (savedLanguage === 'tr' || savedLanguage === 'en' || savedLanguage === 'ar') {
      return savedLanguage;
    }

    return 'tr';
  }

  // HTML dilini ve yazı yönünü ayarlar.
  private applyLanguage(language: AppLanguage): void {
    document.documentElement.lang = language;

    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    const translation = getPrimeNgTranslation(language, this.currentLocale, this.datePickerFormat);
    this.primeNG.setTranslation({
      ...translation,
      aria: {
        ...this.primeNG.getTranslation('aria'),
        ...translation.aria,
      },
    });
  }
}
