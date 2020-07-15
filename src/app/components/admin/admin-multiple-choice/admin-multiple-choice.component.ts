import { Component, OnInit } from '@angular/core';
import { AdminService } from '@services/admin.service';
import { MultipleChoiceService } from '@services/multipleChoice/multiple-choice.service';
import { LanguageService } from '@services/language/language.service';
import { DialogService } from '@services/dialog/dialog.service';

@Component({
  selector: 'app-admin-multiple-choice',
  templateUrl: './admin-multiple-choice.component.html',
  styleUrls: ['./admin-multiple-choice.component.scss']
})
export class AdminMultipleChoiceComponent implements OnInit {

  constructor(
    adminService: AdminService,
    private multipleChoiceService: MultipleChoiceService,
    private languageService: LanguageService,
    private dialogService: DialogService,
  ) {
    adminService.activeComponent.next('multiplechoice');
  }
  selectedLanguage: ILanguage;
  allLanguages: ILanguage[];
  selectedQuestion: IMultipleChoiceQuestion;
  allQuestions: IMultipleChoiceQuestion[];
  questionsFromSelectedLanguage: IMultipleChoiceQuestion[];
  hasChanges = false;

  arr = [1, 2, 3, 4, 5, 6];
  5;

  ngOnInit(): void {
    this.languageService.getLanguages().subscribe(languages => {
      this.allLanguages = languages;
    });
    this.multipleChoiceService.getAllQuestions().subscribe(questions => {
      this.allQuestions = questions;
    });
  }

  selectLanguage = async (language: ILanguage) => {
    if (!this.hasChanges || await this.getConfirmation().then(() => true).catch(() => false)) {
      this.hasChanges = false;
      this.selectedLanguage = language;
      this.setQuestions();
      this.selectedQuestion = undefined;
    }
  }

  selectQuestion = async (question: IMultipleChoiceQuestion) => {
    if (!this.hasChanges || await this.getConfirmation().then(() => true).catch(() => false)) {
      this.hasChanges = false;
      this.selectedQuestion = JSON.parse(JSON.stringify(question));
    }
  }

  setQuestions = (): void => {
    this.questionsFromSelectedLanguage = this.allQuestions.filter(question => {
      return question.languageId === this.selectedLanguage.id;
    });
    this.questionsFromSelectedLanguage.sort((q1, q2) => q1.questionNumber - q2.questionNumber);
  }

  getClass = (buttonName: any): string => {
    if (buttonName === this.selectedLanguage?.language || buttonName === this.selectedQuestion?.questionNumber) {
      return 'selected button';
    } else {
      return 'button';
    }
  }

  addAnswerOption() {
    this.selectedQuestion.multipleChoiceAnswerOptions.push('');
    this.hasChanges = true;
  }

  deleteAnswerOption = (optionNumber: number) => {
    const answerToRemove = this.selectedQuestion.multipleChoiceAnswerOptions[optionNumber];
    this.selectedQuestion.multipleChoiceAnswerOptions.forEach((answer, index) => {
      if (answer === answerToRemove) { this.selectedQuestion.multipleChoiceAnswerOptions.splice(index, 1); }
    });
  }

  // zonder dit worden de antwoorden gedeselecteerd als je een letter typt.
  trackByFn = (index: number) => index;

  canDeactivate = (): Promise<boolean> | boolean => {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (!this.hasChanges) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    return this.getConfirmation();
  }

  // TODO: make this save the question.
  save = () => {
    if (!this.hasChanges) {
      return;
    }
    this.multipleChoiceService.saveQuestion(this.selectedQuestion).subscribe(savedQuestion => {
      this.selectedQuestion = savedQuestion;
      this.allQuestions.forEach(question => {
        if (question.id === savedQuestion.id) {
          question = savedQuestion;
        }
      });
      this.hasChanges = false;
    });
  }

  getConfirmation = () => {
    return this.dialogService.openOkCancel({
      title: 'Are you sure?',
      messages: ['There are unsaved changes, navigating will discard them.']
    });
  }

  deleteQuestion = () => {
    this.multipleChoiceService.deleteQuestion(this.selectedQuestion).subscribe(() => { });
    let i = this.selectedQuestion.questionNumber; // 2
    for (; i < this.questionsFromSelectedLanguage.length; i++) {
      const question = this.questionsFromSelectedLanguage[i]; // 2
      question.questionNumber -= 1;
      this.multipleChoiceService.saveQuestion(question).subscribe(question => { });
    }
    this.questionsFromSelectedLanguage.splice(this.selectedQuestion.questionNumber - 1, 1);
    this.selectedQuestion = undefined;
  }

  addQuestion = () => {
    this.questionsFromSelectedLanguage.push({
      id: undefined,
      question: '',
      questionNumber: this.questionsFromSelectedLanguage.length + 1,
      multipleChoiceAnswerOptions: [],
      languageId: this.selectedLanguage.id,
      correctAnswer: undefined,
    });
    this.selectQuestion(this.questionsFromSelectedLanguage[this.questionsFromSelectedLanguage.length - 1]);
  }

}
