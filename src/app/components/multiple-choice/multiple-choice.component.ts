import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultipleChoiceService } from '@services/multipleChoice/multiple-choice.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageService } from '@services/language/language.service';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: max-line-length
  introtext = 'This is a placeholder text explaining that we are first going to ask a few multiple choice questions and then later the user gets to program stuff';

  language = this.route.snapshot.params.language;
  languageId: number;
  selectedAnswer: string;
  isAnswerCorrect: boolean;
  question: IMultipleChoiceQuestion;
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
    this.isAnswerCorrect = undefined;
    this.chosenAnswerClass = undefined;
    this.completed = false;
    this.$questionSubscription = this.multipleChoiceService.getQuestion(this.language).subscribe(question => {
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
      answer: this.selectedAnswer,
      isAnswerCorrect: undefined
    };
    this.$submissionSubscription = this.multipleChoiceService.getIsAnswerCorrect(multipleChoiceSubmission).subscribe(isAnswerCorrect => {
      this.isAnswerCorrect = isAnswerCorrect;
      if (isAnswerCorrect) { this.chosenAnswerClass = 'correct'; } else { this.chosenAnswerClass = 'wrong'; }
    });
  }

  nextQuestion = (): void => {
    if (this.question.questionNumber === 4) {
      this.router.navigate([`challenge/${this.language}/1`]);
    }
    this.ngOnDestroy();
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    this.$questionSubscription?.unsubscribe();
    this.$submissionSubscription?.unsubscribe();
    this.$languageSubscription?.unsubscribe();
  }

}
