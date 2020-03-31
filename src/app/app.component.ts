import {Component, OnInit} from '@angular/core';
import {ComponentType} from "@angular/cdk/portal";
import {OverlayService} from "./service/overlay/overlay.service";
import {SubscribeComponent} from "./components/overlay/subscribe/subscribe.component";
import {TokenStorageService} from "./service/token/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private roles: string[];
  isLoggedIn = false;
  // these can be used to show information not accessible for normal users
  showAdminBoard = false;
  showModeratorBoard = false;

  constructor(
    private overlayService: OverlayService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
  }
  title = 'code-challenge';

  ngOnInit() {
    if (this.tokenStorageService.isUserLoggedIn()) {
      console.log("user logged in");
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
    }
  }

  subscribeComponent = SubscribeComponent;
  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      // The user clicked away, so don't do anything.
    });
  }

  logout() {
    this.tokenStorageService.logOut()
  }

  myAccount() {
    this.router.navigate(['/profile']);
  }

  checkLogin() {
    return this.tokenStorageService.isUserLoggedIn();
  }
}
