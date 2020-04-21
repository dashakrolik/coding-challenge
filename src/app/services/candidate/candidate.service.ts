import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(
    private http: HttpClientService
  ) { }

  getCandidates = (): Observable<ICandidate[]> => this.http.get('candidates');

  createCandidate = (candidate: ICandidate): Observable<ICandidate> => this.http.post<ICandidate>('candidate', candidate);
}
