import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '@shared/constants';

const AUTH_API = baseUrl + '/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private httpClient: HttpClient
    ) { }

  getLogin(email: string, password: string) {
    console.log('going to login');
    return this.httpClient.post(AUTH_API + 'signin', {
      username: email,
      password
    }, httpOptions);
  }

  getRegister(firstName: string, lastName: string, username: string, password: string) {
    console.log('going to register');
    if (firstName != null && lastName != null) {
      return this.httpClient.post(AUTH_API + 'signup', {
        firstname: firstName,
        lastname: lastName,
        username,
        password
      }, httpOptions);
    } else {
      return this.httpClient.post(AUTH_API + 'signup', {
        username,
        password
      }, httpOptions);
    }
  }
}
