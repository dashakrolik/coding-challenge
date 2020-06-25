import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultipleChoiceService } from '@services/multipleChoice/multiple-choice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: max-line-length
  introtext = 'This is a placeholder text explaining that we are first going to ask a few multiple choice questions and then later the user gets to program stuff';

  question: IMultipleChoiceQuestion;
  selectedAnswer: IMultipleChoiceAnswerOption;
  isAnswerCorrect: IMultipleChoiceIsAnswerCorrect;

  $questionSubscription: Subscription;
  $submissionSubscription: Subscription;

  constructor(
    private multipleChoiceService: MultipleChoiceService,
  ) { }

  ngOnInit(): void {
    this.multipleChoiceService.getQuestion(1).subscribe(question => {
      this.question = question;
    });
  }

  submit = () => {
    // console.log(this.selectedAnswer);
    let submission: IMultipleChoiceSubmission;
    submission = {
      id: undefined,
      questionId: this.question.id,
      answerId: this.selectedAnswer.id,
      isAnswerCorrect: undefined
    };
    this.multipleChoiceService.getIsAnswerCorrect(submission).subscribe(isAnswerCorrect => {
      this.isAnswerCorrect = isAnswerCorrect;
    });
  }

  ngOnDestroy(): void {
    this.$questionSubscription.unsubscribe();
    this.$submissionSubscription.unsubscribe();
  }

}
