import { Component, OnInit } from '@angular/core';
import { ComponentType } from "@angular/cdk/portal";
import { OverlayService } from "./service/overlay/overlay.service";
import { SubscribeComponent } from "./components/overlay/subscribe/subscribe.component";
import { TokenStorageService } from "./service/token/token-storage.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private overlayService: OverlayService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
  }
  title = 'code-challenge';

  ngOnInit() {
  }

  subscribeComponent = SubscribeComponent;
  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);
  }

  logout = (): void => {
    this.tokenStorageService.logOut()
    window.location.reload();
  }

  myAccount = (): void => {
    this.router.navigate(['/profile']);
  }

  checkLogin = (): boolean => {
    return this.tokenStorageService.isUserLoggedIn();
  }
}
