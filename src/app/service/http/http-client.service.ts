import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '@shared/constants';

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

  createSubmission = (submission: Submission) => this.httpClient.post<Submission>(`${baseUrl}/submission`, submission);

  // The call to the backend. Linked to the endpoint to get all candidates.
  getLanguage = () => this.httpClient.get<string>(`${baseUrl}/language`);

  getLanguages = (language: string) => this.httpClient.post<string>(`${baseUrl}/language`, language);

  getTask(subTaskNumber: number) {
    return this.httpClient.get<number>(`${baseUrl}/task/get/` + subTaskNumber + '/');
  }

  getLogin(email: string, password: string) {
    console.log("going to login");
    return this.httpClient.post(`${baseUrl}/auth/signin/`, {
      username: email,
      password: password
    }, httpOptions);
  }

  getRegister(firstName: string, lastName: string, username: string, password: string) {
    console.log("going to register");
    if (firstName != null && lastName != null) {
      return this.httpClient.post(`${baseUrl}/auth/signup/`, {
        firstname: firstName,
        lastname: lastName,
        username: username,
        password: password
      }, httpOptions);
    } else {
      return this.httpClient.post(`${baseUrl}/auth/signup`, {
        username: username,
        password: password
      }, httpOptions);
    }
  }
}
