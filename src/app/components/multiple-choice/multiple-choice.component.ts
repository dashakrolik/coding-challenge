import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultipleChoiceService } from '@services/multipleChoice/multiple-choice.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: max-line-length
  introtext = 'This is a placeholder text explaining that we are first going to ask a few multiple choice questions and then later the user gets to program stuff';

  questionNumber = parseInt(this.route.snapshot.params.questionId);
  language = this.route.snapshot.params.language;
  question: IMultipleChoiceQuestion;
  selectedAnswer: IMultipleChoiceAnswerOption;
  isAnswerCorrect: IMultipleChoiceIsAnswerCorrect;
  chosenAnswerClass: string;
  completed: boolean;

  $questionSubscription: Subscription;
  $submissionSubscription: Subscription;

  constructor(
    private multipleChoiceService: MultipleChoiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.completed = false;
    this.$questionSubscription = this.multipleChoiceService.getQuestion(this.questionNumber).subscribe(question => {
      this.question = question;
    });
  }

  submit = () => {
    this.completed = true;
    let multipleChoiceSubmission: IMultipleChoiceSubmission;
    multipleChoiceSubmission = {
      id: undefined,
      questionId: this.question.id,
      answerId: this.selectedAnswer.id,
      isAnswerCorrect: undefined
    };
    this.$submissionSubscription = this.multipleChoiceService.getIsAnswerCorrect(multipleChoiceSubmission).subscribe(isAnswerCorrect => {
      this.isAnswerCorrect = isAnswerCorrect;
      if (isAnswerCorrect.isCorrect) { this.chosenAnswerClass = 'correct'; } else { this.chosenAnswerClass = 'wrong'; }
    });
  }

  nextQuestion = (): void => {
    this.questionNumber++;
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    this.$questionSubscription.unsubscribe();
    this.$submissionSubscription.unsubscribe();
  }

}
