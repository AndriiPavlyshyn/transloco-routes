import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getBrowserLang, TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private activeLang$ = new BehaviorSubject<string | null>(this.getLocalStorLang());
  public direction$ = new Subject<string>();

  constructor(
    private translocoService: TranslocoService,
    private router: Router
  ) {
    this.checkDir();
  }

  public setLanguage(lang: string): void {
    this.activeLang$.next(lang);
    this.translocoService.setActiveLang(lang);
    this.setLocalStorLang(lang);
  }

  public switchLang(lang: string, route?: string): void {
    this.setLanguage(lang);

    if(route) {
      this.router.navigate([lang, route]);
    } else {
      this.router.navigate([lang]);
    }
  }

  // * IMPORTANT: Setting app language on init
  // * USE IT IN PARENT ROUTE COMPONENT ( PAGE )
  public setAppLang(route: ActivatedRoute): void {
    const urlArray = route.snapshot.url;

    if(urlArray.length > 0) {
      // If has param in url - set
      const langParam: string = urlArray[0].path;

      if(langParam) {
        this.setLanguage(langParam);
      } else {
        this.setBrowserLang();
      }

      this.checkDir();
    }
  }

  public setBrowserLang(): void {
    const browserLang: string | undefined = getBrowserLang();
    const existingLangs: any | string[] = this.translocoService.getAvailableLangs();

    if(existingLangs.includes(browserLang) && browserLang) {
      this.setLanguage(browserLang);
    } else {
      this.setLocalStorLang('en');
      this.router.navigate(['en']);
    }
  }

  public checkDir(): void {
    const rtlLangs = ['ar', 'an', 'he', 'dv', 'ku', 'kur', 'fa', 'per', 'ur', 'urd'];

    this.activeLang$
      .subscribe((lang: string | null) => {
        if(lang && rtlLangs.includes(lang)) {
          this.direction$.next('rtl');
        } else {
          this.direction$.next('ltr');
        }
      });
  }

  private setLocalStorLang(lang: string): void {
    localStorage.setItem('app-lang', lang);
  }

  private getLocalStorLang(): string | null {
    return localStorage.getItem('app-lang');
  }
}
