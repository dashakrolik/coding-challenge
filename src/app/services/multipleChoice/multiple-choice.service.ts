import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultipleChoiceService {

  private readonly endpoint = 'multi';

  constructor(
    private http: HttpClientService
  ) { }

  getQuestion = (questionid: number): Observable<IMultipleChoiceQuestion> => this.http.get(this.endpoint + '/' + questionid);

  getIsAnswerCorrect = (submission: IMultipleChoiceSubmission): Observable<IMultipleChoiceIsAnswerCorrect> => {
    return this.http.post(this.endpoint + '/submit', submission);
  }

}
