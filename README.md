# How to implement

1. Install transloco `npm i @ngneat/transloco`
2. Add translate (`app/services/translate-service`) service to your project
3. In `app.component.html` wrap `<router-outlet>` in wrapper and add `[dir]="dir"`, this param will change direction of app **(rtl or ltr)**

`app.component.html`
```
<div class="page-wrapper" [dir]="dir">
  <router-outlet></router-outlet>
</div>
```
`app.component.ts`
```
private dirSub!: Subscription;
  public dir!: string ;

  constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) { }

  ngAfterViewInit(): void {
    this.dirSub = this.translateService.direction$
      .subscribe((dir: string) => {
        this.dir = dir;
        this.cdr.detectChanges();
      })
  }

  ngOnDestroy(): void {
    if(this.dirSub) {
      this.dirSub.unsubscribe();
    }
  }
```

4. In `app-routing.module.ts`
### Have children routes?

if you have children routes create const `children`
```
const children: Route[] = [
  // { path: '', redirectTo: '/detail', pathMatch: 'full' },
  { path: 'test', component: HomeComponent }
]
```
Parent routes it's a language keys like `en` or `ru`, `uk` and so one. For children we use our ``children`` const, because it need to be the same. But for example if you don't need some page translate, you can create it's own children routes.

Parent route have to use parent component. **( like a wrapper for all page components )**

If script will not find app language in local storage - it will set english by default.

**Routes:**

```
const routes: Routes = [
  {
    path: 'en',
    component: HomeComponent,
    children: children
  },
  {
    path: 'ar',
    component: HomeComponent,
    children: children,
  },
  { path: '**', redirectTo: localStorage.getItem('app-lang') || 'en' },
];
```

5. In parent component **( In example it's HomeComponent )** init the `setAppLang(this.route)` methode from `translate-service` where **this.route** is ``ActivatedRoute``

## Service Methods

`setLanguage(lang: string): void` - switch language by param ( lang key )

---

`switchLang(lang: string, route?: string): void`

**Params**:

1. **lang: string** - language key
2. **route: route?: string** - if you need to go to children route, please set this route as second param.

**Example**:

``translateService.switchLang('en', 'test')`` will navigate you to `/en/test`

---

`setAppLang(route: ActivatedRoute): void` - created to set app lang by default, by default use it only in app parent component.

--- 

`setBrowserLang(): void` - set browser's language as app language, if it exists in list of supported languages.




