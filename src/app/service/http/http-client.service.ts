import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { baseUrl } from '../../shared/constants';
import { map } from 'rxjs/operators';

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

  // TODO: candidate is changed. This doesn't work anymore.
  getCandidates = () => this.httpClient.get<Candidate[]>(`${baseUrl}/candidate`);

  createCandidate = (candidate: Candidate) => this.httpClient.post<Candidate>(`${baseUrl}/candidate`, candidate);

  createSubmission = (submission: Submission) => this.httpClient.post<Submission>(`${baseUrl}/submission/create`, submission);

  getLanguage = (language: string) => this.httpClient.post<string>(`${baseUrl}/language/get`, language);

  getTask(subTaskNumber: number) {
    // TODO: right now how you identify a task from the backend is by comparing the task description itself.
    //  Maybe find a way to identify them more easily like an id that is syncronized over both front and backend
    return this.httpClient.get<number>(`${baseUrl}/api/v1.0/task/get/` + subTaskNumber + '/');
  }

  getLogin(username: string, password: string) {
    console.log("going to login");
    console.log(username);
    console.log(password);
    return this.httpClient.post(AUTH_API + 'signin', {
      username: username,
      password: password
    }, httpOptions);
  }

  getRegister(firstName: string, lastName: string, username: string, password: string) {
    console.log("going to register");
    console.log(firstName);
    console.log(lastName);
    console.log(username);
    console.log(password);
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
