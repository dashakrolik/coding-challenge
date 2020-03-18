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
}
