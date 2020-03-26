import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCandidates = () => this.httpClient.get<Candidate[]>(`${baseUrl}/candidate`);

  createCandidate = (candidate: Candidate) => this.httpClient.post<Candidate>(`${baseUrl}/candidate`, candidate);

  createSubmission = (submission: Submission) => this.httpClient.post<Submission>(`${baseUrl}/submission`, submission);

  // The call to the backend. Linked to the endpoint to get all candidates.
  getLanguage = () => this.httpClient.get<String>('http://localhost:8080/language');

  getLanguages = (language: string) => this.httpClient.post<string>(`${baseUrl}/language`, language);

  getTask(subTaskNumber: number) {
    // TODO: right now how you identify a task from the backend is by comparing the task description itself.
    //  Maybe find a way to identify them more easily like an id that is syncronized over both front and backend
    return this.httpClient.get<number>(`${baseUrl}/api/v1.0/task` + subTaskNumber + '/');
  }
}
