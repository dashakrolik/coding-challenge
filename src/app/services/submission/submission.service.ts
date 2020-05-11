import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientService } from '../http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  submissionEndpoint = 'submission'

  constructor(
    private http: HttpClientService
  ) { }

  getAllSubmissionsFromPerson = (personId: number): Observable<ISubmission[]> => this.http.get(this.submissionEndpoint + "/" + personId);
  
  getAllSubmissionsProfile = (): Observable<ISubmission[]> => this.http.get(this.submissionEndpoint + '/person');

  createSubmission = (submission: ISubmission): Observable<boolean[]> => this.http.post<ISubmission>(this.submissionEndpoint, submission);

  runCode = (submission: ISubmission): Observable<IJupyterResponse[]> => this.http.post<ISubmission>(this.submissionEndpoint + '/runcode', submission);
}
