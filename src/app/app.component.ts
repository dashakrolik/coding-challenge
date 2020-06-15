import { ComponentType } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '@services/token/token-storage.service';

import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';

import { OverlayService } from './services/overlay/overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'code-challenge';
  subscribeComponent = SubscribeComponent;

  constructor(
    private overlayService: OverlayService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
  }

  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);
  }

  logout = (): void => {
    this.tokenStorageService.logOut();
    this.router.navigate(['']);
  }

  myAccount = (): Promise<boolean> => this.router.navigate(['/profile']);

  checkLogin = (): boolean => this.tokenStorageService.isUserLoggedIn();

}
