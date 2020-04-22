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

  createSubmission = (submission: ISubmission): Observable<boolean[]> => this.http.post<ISubmission>('submission', submission);

  runCode = (submission: ISubmission): Observable<ISubmission> => this.http.post<ISubmission>('runcode', submission);
}
