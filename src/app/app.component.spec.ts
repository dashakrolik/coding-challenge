import { async, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component, NgZone } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterModule, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { OverlayService } from '@services/overlay/overlay.service';

import { AppComponent } from './app.component';
import { TokenStorageService } from '@services/token/token-storage.service';

const WELCOME_PAGE_STUB_TITLE = 'welcome page stub';

@Component({ selector: 'app-welcome-page', template: `<h1>${WELCOME_PAGE_STUB_TITLE}</h1>` })
class WelcomePageStubComponent { }

@Component({ selector: 'app-leaderboard', template: '<h1>leaderboard stub</h1>' })
class LeaderboardStubComponent { }

@Component({ selector: 'app-profile', template: '<h1>profile stub</h1>' })
class ProfileStubComponent { }

const mockRoutes: Routes = [
  {
    path: '',
    component: WelcomePageStubComponent
  },
  {
    path: 'profile',
    component: ProfileStubComponent,
  },
  {
    path: 'leaderboard',
    component: LeaderboardStubComponent,
  },
];

describe('AppComponent', () => {
  let location: Location;
  let router: Router;
  const OverlayServiceSpy: jasmine.SpyObj<{}> = null;
  let TokenStorageServiceSpy: jasmine.SpyObj<{ isUserLoggedIn: () => boolean }>;
  let fixture;

  describe('when logged out', () => {

    beforeEach(async(() => {
      TokenStorageServiceSpy = jasmine.createSpyObj('TokenStorageService', ['isUserLoggedIn']);
      TokenStorageServiceSpy.isUserLoggedIn.and.returnValue(false);

      TestBed.configureTestingModule({
        imports: [
          RouterModule,
          RouterTestingModule.withRoutes(mockRoutes)
        ],
        declarations: [
          AppComponent, WelcomePageStubComponent, LeaderboardStubComponent
        ],
        providers: [AppComponent, { provide: OverlayService, useValue: OverlayServiceSpy }, 
          { provide: TokenStorageService, useValue: TokenStorageServiceSpy }]
      }).compileComponents();

      router = TestBed.inject(Router);
      location = TestBed.inject(Location);

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
      expect(location.path()).toBe('/leaderboard');
    }));

    it('calls isUserLoggedIn from the template via the checkLogin method', () => {
      const fixtureVar = TestBed.createComponent(AppComponent);
      fixtureVar.detectChanges();
      expect(TokenStorageServiceSpy.isUserLoggedIn).toHaveBeenCalledTimes(6);
    });
  });

  describe('when logged in', () => {

    beforeEach(async(() => {
      TokenStorageServiceSpy = jasmine.createSpyObj('TokenStorageService', ['isUserLoggedIn']);
      TokenStorageServiceSpy.isUserLoggedIn.and.returnValue(true);

      TestBed.configureTestingModule({
        imports: [
          RouterModule,
          RouterTestingModule.withRoutes(mockRoutes)
        ],
        declarations: [
          AppComponent, WelcomePageStubComponent, LeaderboardStubComponent
        ],
        providers: [AppComponent, { provide: OverlayService, useValue: OverlayServiceSpy }, 
          { provide: TokenStorageService, useValue: TokenStorageServiceSpy }]
      }).compileComponents();

      router = TestBed.inject(Router);
      location = TestBed.inject(Location);

      fixture = TestBed.createComponent(AppComponent);
      router.initialNavigation();
    }));

    it('renders My Account, Logout, and Leaderboard buttons', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const [firstButton, secondButton, thirdButton] = compiled.querySelectorAll('button');
      expect(firstButton.textContent).toContain('My Account');
      expect(secondButton.textContent).toContain('Logout');
      expect(thirdButton.textContent).toContain('Leaderboard');
    });

    it('navigates to /profile when My Account button is clicked', fakeAsync(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      compiled.querySelector('button[name=my-account]').click();
      tick();
      expect(location.path()).toBe('/profile');
    }));
  });
});
