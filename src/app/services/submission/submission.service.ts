import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '@shared/constants';

import { HttpClientService } from '../http/http-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  endpoint = 'submission'

  constructor(
    private http: HttpClientService,
    private httpClient: HttpClient
  ) { }

  getAllSubmissionsFromPerson = (personId: number): Observable<ISubmission[]> => this.http.get(this.endpoint + "/" + personId);

  getAllSubmissionsProfile = (): Observable<ISubmission[]> => this.http.get(this.endpoint + '/person');

  createSubmission = (submission: ISubmission): Observable<boolean[]> => this.http.post<ISubmission>(this.endpoint, submission);

  // TODO: set the return type to the new and correct response.
  runCode = (submission: ISubmission, kernelId: string): any => {
    console.log('going to run code');
    return this.httpClient.post(baseUrl + '/submission/runcode', {
      submission,
      kernelId,
    }, httpOptions);
  }
}
