import { Injectable } from '@angular/core';
import { TokenStorageService } from '@service/token/token-storage.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) { }

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    if (this.tokenStorageService.isUserLoggedIn()) {
      return true;
    }

    // If the user is not allowed here, navigate back to home.
    // TODO: Show an errro page maybe?
    this.router.navigate(['']);
    return false;
  }

}
