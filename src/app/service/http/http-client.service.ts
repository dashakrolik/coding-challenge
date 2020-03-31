import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '@shared/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private http: HttpClient
  ) { }

  get = (path: string): Observable<any> => this.http.get(`${baseUrl}/${path}`);

  post<T>(path: string, payload: T): Observable<any> {
    return this.http.post(`${baseUrl}/${path}`, payload);
  }

  put<T>(path: string, payload: T): Observable<any> {
    return this.http.put(`${baseUrl}/${path}`, payload);
  }

  delete = (path: string): Observable<any> => {
    return this.http.delete(`${baseUrl}/${path}`);
  }

  getCandidates = () => this.http.get<Candidate[]>(`${baseUrl}/candidate`);

  createCandidate = (candidate: Candidate) => this.http.post<Candidate>(`${baseUrl}/candidate`, candidate);

  createSubmission = (submission: Submission) => this.http.post<Submission>(`${baseUrl}/submission`, submission);

  // The call to the backend. Linked to the endpoint to get all candidates.
  getLanguage = () => this.http.get<string>('http://localhost:8080/language');

  getLanguages = (language: string) => this.http.post<string>(`${baseUrl}/language`, language);

  getTask(subTaskNumber: number) {
    // TODO: right now how you identify a task from the backend is by comparing the task description itself.
    //  Maybe find a way to identify them more easily like an id that is syncronized over both front and backend
    return this.http.get<number>(`${baseUrl}/api/v1.0/task` + subTaskNumber + '/');
  }
}
