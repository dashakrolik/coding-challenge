import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientService } from '../http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  endpoint = 'submission'

  constructor(
    private http: HttpClientService
  ) { }

  getAllSubmissionsFromPerson = (personId: number): Observable<ISubmission[]> => this.http.get(this.endpoint + "/" + personId);
  
  getAllSubmissionsProfile = (): Observable<ISubmission[]> => this.http.get(this.endpoint + '/person');

  createSubmission = (submission: ISubmission): Observable<boolean[]> => this.http.post<ISubmission>(this.endpoint, submission);

  runCode = (submission: ISubmission): Observable<IJupyterResponse[]> => this.http.post<ISubmission>(this.endpoint + '/runcode', submission);
}
