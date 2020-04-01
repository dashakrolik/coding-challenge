import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from "../../service/token/token-storage.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  content = '';

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.tokenStorageService.isUserLoggedIn()) {
      const user = this.tokenStorageService.getUser();
      const roles = user.roles;
      console.log(user);
      if (user.firstname == null && user.lastname == null) {
        this.content = "Hello " + user.username + "\nRole: " + roles;
      } else {
        this.content = "Hello " + user.firstname + " " + user.lastname + "  Role: " + roles;
      }
    } else {
      this.content = "nobody is logged in, please log in or create an account"
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

}
