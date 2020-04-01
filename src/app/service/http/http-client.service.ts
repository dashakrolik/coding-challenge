import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { baseUrl } from '../../shared/constants';

const AUTH_API = 'http://localhost:8080/api/v1.0/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCandidates = () => this.httpClient.get<Candidate[]>(`${baseUrl}/person`);

  createSubmission = (submission: Submission) => this.httpClient.post<Submission>(`${baseUrl}/submission/create`, submission);

  getLanguage = (language: string) => this.httpClient.post<string>(`${baseUrl}/language/get`, language);

  getTask(subTaskNumber: number) {
    return this.httpClient.get<number>(`${baseUrl}/task/get/` + subTaskNumber + '/');
  }

  getLogin(email: string, password: string) {
    console.log("going to login");
    return this.httpClient.post(AUTH_API + 'signin', {
      username: email,
      password: password
    }, httpOptions);
  }

  getRegister(firstName: string, lastName: string, username: string, password: string) {
    console.log("going to register");
    if (firstName != null && lastName != null) {
      return this.httpClient.post(AUTH_API + 'signup', {
        firstname: firstName,
        lastname: lastName,
        username: username,
        password: password
      }, httpOptions);
    } else {
      return this.httpClient.post(AUTH_API + 'signup', {
        username: username,
        password: password
      }, httpOptions);
    }
  }
}
