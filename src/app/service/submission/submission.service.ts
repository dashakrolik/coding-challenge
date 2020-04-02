import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Submission } from '../../types/Submission.d';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private submissionUrl = 'http://localhost:8080/api/v1.0/submission';

  constructor(
    private http: HttpClient
  ) { }

  getAllSubmissionsFromPerson = (personId: number): Observable<Submission[]> => {
    return this.http.get<Submission[]>(this.submissionUrl + '/' + personId);
  }

}
