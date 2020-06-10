import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '@shared/constants';
import { HttpClientService } from '@services/http/http-client.service';

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

  createSubmission = (submission: ISubmission, kernelId?: string): Observable<ISubmitCodeResponse> => {
    
    return this.http.post('submission', {
      submission,
      kernelId,
    });
  }

  runCode = (submission: ISubmission, kernelId: string): Observable<IRunCodeResponse> => {
    
    return this.http.post('submission/runcode', {
      submission,
      kernelId,
    });
  }
}
