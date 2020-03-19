import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Candidate} from "../../components/candidate/Candidate";
import {Submission} from "../../components/code-editor/Submission";

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient:HttpClient
  ) { }

  getCandidates() {
    // The call to the backend. Linked to the endpoint to get all candidates.
    return this.httpClient.get<Candidate[]>('http://localhost:8080/candidates');
  }

  createCandidate(candidate: Candidate) {
    return this.httpClient.post<Candidate>('http://localhost:8080/candidate/create', candidate);
  }

  createSubmission(submission: Submission) {
    return this.httpClient.post<Submission>('http://localhost:8080/submission/create', submission);
  }

  getLanguage(language: String) {
    // The call to the backend. Linked to the endpoint to get all candidates.
    return this.httpClient.post<String>('http://localhost:8080/language/get', language);
  }

  getTask(task: String) {
    // TODO: right now how you idenitify a task from the backend is by comparing the task description itself.
    //  Maybe find a way to identify them more easily like an id that is syncronized over both front and backend
    return this.httpClient.post<String>('http://localhost:8080/task/get', task);
  }
}
