import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RedirectionService {
  private readonly REDIRECT_CHECK_KEY = 'hasCheckedRedirection';

  checkAndRedirect(): void {
    const hasCheckedRedirection = localStorage.getItem(this.REDIRECT_CHECK_KEY);
    if (!hasCheckedRedirection) {
      const currentUrl: string = window.location.href;
      if (
        currentUrl.startsWith('https://lautacolella.web.app') ||
        currentUrl.startsWith('https://lautacolella.firebaseapp.com')
      ) {
        window.location.replace('https://lauta.ro');
      } else {
        localStorage.setItem(this.REDIRECT_CHECK_KEY, 'true');
      }
    }
  }
}
