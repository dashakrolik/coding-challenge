import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private http: HttpClientService
  ) { }

  getAllSubmissionsFromPerson = (personId: number): Observable<ISubmission[]> => this.http.get('submission/' + personId);

  createSubmission = (submission: ISubmission): Observable<ISubmission> => this.http.post<ISubmission>('submission', submission);
}
