import { inject } from '@angular/core'; // inject fonksiyonu, Angular'ın bağımlılık enjeksiyonu sistemini kullanarak bir servisi veya bağımlılığı bileşen veya servis içinde enjekte etmek için kullanılır.
import { CanActivateChildFn, Router } from '@angular/router'; // CanActivateChildFn, Angular yönlendirme sisteminde bir rota koruyucu işlevini temsil eder. Bu işlev, bir kullanıcının belirli bir rotaya erişip erişemeyeceğini belirlemek için kullanılır. Router ise Angular'ın yönlendirme hizmetidir ve uygulama içinde gezinmeyi yönetir.

import { AuthService } from '../services/auth'; // AuthService, kullanıcıların kimlik doğrulama işlemlerini yönetmek için kullanılan bir servistir.

// AuthGuard, kullanıcıların belirli rotalara erişimini kontrol etmek için kullanılan bir Angular yönlendirme koruyucusudur.

export const authGuard: CanActivateChildFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Kullanıcının erişim token'ı varsa, rotaya erişime izin verilir; aksi takdirde kullanıcı giriş sayfasına yönlendirilir.
  return auth.getAccessToken()
    ? true
    : router.createUrlTree(['/login']);
};