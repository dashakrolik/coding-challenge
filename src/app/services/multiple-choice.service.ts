import { Injectable } from '@angular/core';
import { HttpClientService } from './http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultipleChoiceService {

  readonly endpoint = 'multiple_choice';

  constructor(
    private http: HttpClientService
  ) { }

  getQuestion = (questionid: number): Observable<IMultipleChoiceQuestion> => this.http.get(this.endpoint + '/' + questionid);

  postAnswer = (answerNumber: number, questionid: number): Observable<boolean> => {
    return this.http.post(this.endpoint, { answerNumber, questionid });
  }
}
