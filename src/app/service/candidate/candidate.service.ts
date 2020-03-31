import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  candidates: Observable<Candidate[]>;

  constructor(
    private http: HttpClientService
  ) { }

  getCandidates = (): Observable<Candidate[]> => this.http.get('candidates');
}
