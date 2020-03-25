import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCandidates = () => this.httpClient.get<Candidate[]>(`${baseUrl}/candidate`);

  createCandidate = (candidate: Candidate) => this.httpClient.post<Candidate>(`${baseUrl}/candidate`, candidate);

  createSubmission = (submission: Submission) => this.httpClient.post<Submission>(`${baseUrl}/submission/create`, submission);

  getLanguage = (language: string) => this.httpClient.post<string>(`${baseUrl}/language/get`, language);

  getTask = (task: string) => {
    // TODO: right now how you idenitify a task from the backend is by comparing the task description itself.
    //  Maybe find a way to identify them more easily like an id that is syncronized over both front and backend
    return this.httpClient.post<string>(`${baseUrl}/task/get`, task);
  }
}
