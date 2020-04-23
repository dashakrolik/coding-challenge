import { Component } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { Router } from '@angular/router';

import { OverlayService,  } from '@services/overlay/overlay.service';
import { TokenStorageService } from '@services/token/token-storage.service';

import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    window.location.reload();
  }

  myAccount = (): Promise<boolean> => this.router.navigate(['/profile']);

  checkLogin = (): boolean => this.tokenStorageService.isUserLoggedIn();

}
