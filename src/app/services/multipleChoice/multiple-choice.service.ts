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

  getAllQuestions(): Observable<IMultipleChoiceQuestion[]> {
    return this.http.get(this.endpoint);
  }

  getQuestion = (language: string): Observable<IMultipleChoiceQuestion> => {
    return this.http.get(this.endpoint + '/' + language);
  }

  getSubmissionsByPersonId = (personId: number): Observable<ISubmission[]> => {
    return this.http.get(this.endpoint + '/submit/' + personId);
  }

  getIsAnswerCorrect = (submission: IMultipleChoiceSubmission): Observable<boolean> => {
    return this.http.post(this.endpoint + '/submit', submission);
  }

  saveQuestion = (question: IMultipleChoiceQuestion): Observable<IMultipleChoiceQuestion> => {
    return this.http.post(this.endpoint, question);
  }

  deleteQuestion = (question: IMultipleChoiceQuestion): Observable<void> => {
    return this.http.delete(this.endpoint, question);
  }

}
