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

  getAllSubmissionsFromPerson = (personId: number): Observable<Submission[]> => this.http.get('submission/' + personId);

  createSubmission = (submission: Submission): Observable<Submission> => this.http.post<Submission>('submission', submission);
}
