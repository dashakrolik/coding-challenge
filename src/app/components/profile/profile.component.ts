import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '@services/token/token-storage.service';

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
      if (user.firstname == null && user.lastname == null) {
        this.content = 'Hello ' + user.username + '\nRole: ' + roles;
      } else {
        this.content = 'Hello ' + user.firstname + ' ' + user.lastname + '  Role: ' + roles;
      }
    } else {
      this.content = 'nobody is logged in, please log in or create an account';
    }
  }

  goHome = (): Promise<boolean> => this.router.navigate(['/']);

}
