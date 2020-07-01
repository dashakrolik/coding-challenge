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

  getQuestion = (language: string, questionNumber: number): Observable<IMultipleChoiceQuestion> => {
    return this.http.get(this.endpoint + '/' + language + '/' + questionNumber);
  }

  getIsAnswerCorrect = (submission: IMultipleChoiceSubmission): Observable<boolean> => {
    return this.http.post(this.endpoint + '/submit', submission);
  }

}
