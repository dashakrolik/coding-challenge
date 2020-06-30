import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientService } from '@services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  endpoint = 'submission';

  constructor(
    private http: HttpClientService,
    private httpClient: HttpClient
  ) { }

  getAllSubmissionsFromPerson = (personId: number): Observable<ISubmission[]> => this.http.get(this.endpoint + '/' + personId);

  getAllSubmissionsProfile = (): Observable<ISubmission[]> => this.http.get(this.endpoint + '/person');

  createSubmission = (submission: ISubmission): Observable<boolean[]> => {
    
    return this.http.post('submission', submission);
  }

  runCode = (submission: ISubmission): Observable<IJupyterResponse[]> => {
    
    return this.http.post('submission/runcode', submission);
  }
}
