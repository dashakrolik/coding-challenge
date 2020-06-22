import { async, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component, NgZone } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterModule, Routes } from '@angular/router';
import { Location } from "@angular/common";
import { OverlayService } from '@services/overlay/overlay.service';

import { AppComponent } from './app.component';

const WELCOME_PAGE_STUB_TITLE = 'welcome page stub';

@Component({ selector: 'app-welcome-page', template: `<h1>${WELCOME_PAGE_STUB_TITLE}</h1>` })
class WelcomePageStubComponent { }

@Component({ selector: 'app-leaderboard', template: '<h1>leaderboard stub</h1>' })
class LeaderboardStubComponent { }

const mockRoutes: Routes = [
  {
    path: '',
    component: WelcomePageStubComponent
  },
  {
    path: 'leaderboard',
    component: LeaderboardStubComponent,
  },
];

fdescribe('AppComponent', () => {
  let location: Location;
  let router: Router;
  let OverlayServiceSpy: jasmine.SpyObj<{}>;
  let fixture;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        RouterTestingModule.withRoutes(mockRoutes)
      ],
      declarations: [
        AppComponent, WelcomePageStubComponent, LeaderboardStubComponent
      ],
      providers: [AppComponent, { provide: OverlayService, useValue: OverlayServiceSpy }]
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  }));

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`has the title 'code-challenge'`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('code-challenge');
  });

  it('renders Login and Leaderboard buttons', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const [firstButton, secondButton] = compiled.querySelectorAll('button');
    expect(firstButton.textContent).toContain('Login');
    expect(secondButton.textContent).toContain('Leaderboard');
  });

  it('loads the default route', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(WELCOME_PAGE_STUB_TITLE);
  });

  it('navigates to /leaderboard when Leaderboard button is clicked', fakeAsync(() => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    compiled.querySelector('button[name=leaderboard]').click();
    tick();
    expect(location.path()).toBe("/leaderboard")
  }));

  // TODO test checkLogin, myAccount, logout, loginWIndow
});
