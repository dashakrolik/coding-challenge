import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientService } from '../http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http: HttpClientService
  ) { }

  getFeedback = (): Observable<IFeedback[]> => this.http.get('feedback');

  sendFeedback = (feedback: string): Observable<Boolean> => {    
    return this.http.post('feedback', feedback);
  }
}
