import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { TokenStorageService } from '@services/token/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) { }

  // tslint:disable-next-line: variable-name
  canActivate = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    if (this.tokenStorageService.isUserLoggedIn()) {
      return true;
    }

    // If the user is not allowed here, navigate back to home.
    // TODO: Show an errro page maybe?
    this.router.navigate(['']);
    return false;
  }

}
