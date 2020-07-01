import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultipleChoiceService } from '@services/multipleChoice/multiple-choice.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageService } from '@services/language/language.service';
import { take } from 'rxjs/operators';

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
  languageId: number;
  question: IMultipleChoiceQuestion;
  selectedAnswer: IMultipleChoiceAnswerOption;
  isAnswerCorrect: IMultipleChoiceIsAnswerCorrect;
  chosenAnswerClass: string;
  completed: boolean;

  $questionSubscription: Subscription;
  $submissionSubscription: Subscription;
  $languageSubscription: Subscription;

  constructor(
    private multipleChoiceService: MultipleChoiceService,
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.completed = false;
    this.$questionSubscription = this.multipleChoiceService.getQuestion(this.language, this.questionNumber).subscribe(question => {
      this.question = question;
    });
    this.$languageSubscription = this.languageService.getLanguages().subscribe(languages => {
      languages.forEach((language => {
        if (language.language === this.language) { this.languageId = language.id; }
      }));
    });
  }

  submit = () => {
    this.completed = true;
    let multipleChoiceSubmission: IMultipleChoiceSubmission;
    multipleChoiceSubmission = {
      id: undefined,
      personId: undefined,
      languageId: this.languageId,
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
