import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getBrowserLang, TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { BehaviorSubject } from 'rxjs';

export type Direction = 'rtl' | 'ltr';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private readonly rtlLangs: string[] = ['ar', 'an', 'he', 'dv', 'ku', 'kur', 'fa', 'per', 'ur', 'urd'];
  private readonly storedLang: string = this.getLocalStorLang();

  public activeLang$: BehaviorSubject<string> = new BehaviorSubject('ltr');

  constructor(
    private translocoService: TranslocoService,
    private router: Router
  ) {}

  public setLanguage(lang: string): void {
    this.activeLang$.next(lang);
    this.translocoService.setActiveLang(lang);
    this.setLocalStorLang(lang);
  }

  public switchLang(lang: string, route?: string): void {
    this.setLanguage(lang);

    if(route) {
      this.router.navigate([lang, route], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate([lang], { queryParamsHandling: 'preserve' });
    }
  }

  // * IMPORTANT: Setting app language on init
  // * USE IT IN PARENT ROUTE COMPONENT ( PAGE )
  public setAppLang(route: ActivatedRoute): void {
    const activeLang: string = route.routeConfig?.path!;

    if(activeLang === '' || activeLang === 'en') {
      if(this.storedLang === 'en' || this.storedLang === '') {
        this.switchLang('en');
        return;
      }

      if(this.storedLang !== 'en') {
        this.switchLang(this.storedLang);
        return;
      }
    }

    if(activeLang !== '') {
      this.switchLang(activeLang);
      return;
    }
  }

  public getDir(activeLang: string): Direction {
    if(this.rtlLangs.includes(activeLang)) {
      return 'rtl';
    } else {
      return 'ltr';
    }
  }

  private setStoredLang(): void {
    const browserLang: string | undefined = getBrowserLang();
    const existingLangs: any | string[] = this.translocoService.getAvailableLangs();

    // If no local lang, try to set browser lang if it exists
    if(existingLangs.includes(browserLang) && browserLang) {
      this.setLanguage(browserLang);
      return;
    }

    // If browser lang does not in supported langs
    if(!existingLangs.includes(browserLang)) {
      this.switchLang('en');
      return;
    }
  }

  private setLocalStorLang(lang: string): void {
    localStorage.setItem('app-lang', lang);
  }

  private getLocalStorLang(): string {
    return localStorage.getItem('app-lang')!;
  }
}
