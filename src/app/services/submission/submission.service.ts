import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientService } from '../http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private http: HttpClientService
  ) { }

  getAllSubmissionsFromPerson = (personId: number): Observable<ISubmission[]> => this.http.get('submission/' + personId);
  
  getAllSubmissionsProfile = (): Observable<ISubmission[]> => this.http.get('submission/person');

  createSubmission = (submission: ISubmission): Observable<boolean[]> => this.http.post<ISubmission>('submission', submission);

  runCode = (submission: ISubmission): Observable<JupyterResponse[]> => this.http.post<ISubmission>('submission/runcode', submission);
}
