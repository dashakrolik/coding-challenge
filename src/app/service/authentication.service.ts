import { Injectable } from '@angular/core';
import {HttpClientService} from "./http/http-client.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  loginUser(email, password) {
    console.log("login user");
    // If it succeeds we store the user in the session storage.
    this.httpClientService.getLogin(email, password).subscribe(
      response => this.handleSuccessfulResponseGetLogin(response),
    );
    return true;
    // if (username === "javainuse" && password === "password") {
    //   console.log("good");
    //   sessionStorage.setItem('username', username);
    //   return true;
    // } else {
    //   console.log("bad");
    //   return false;
    // }
  }

  registerUser(firstName, lastName, email, password) {
    console.log("register user");
    // If it succeeds we store the user in the session storage.
    this.httpClientService.getRegister(firstName, lastName, email, password).subscribe(
      response => this.handleSuccessfulResponseGetRegister(response),
    );
    return true;
    // if (username === "javainuse" && password === "password") {
    //   console.log("good");
    //   sessionStorage.setItem('username', username);
    //   return true;
    // } else {
    //   console.log("bad");
    //   return false;
    // }
  }

  handleSuccessfulResponseGetLogin = (response): void => {
    console.log("successful post message get login");
    console.log(response);
  };

  handleSuccessfulResponseGetRegister = (response): void => {
    console.log("successful post message get register");
    console.log(response);
  };

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username');
    console.log(!(user === null));
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('username');
  }
}
