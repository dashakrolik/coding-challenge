import { Component, TemplateRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AceEditorComponent } from 'ng2-ace-editor';

import { CandidateService } from '@service/candidate/candidate.service';
import { TaskService } from '@service/task/task.service';
import { SubmissionService } from '@service/submission/submission.service';
import { LanguageService } from '@service/language/language.service';

import { Subscription } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubmitDialogComponent } from '@components/submit-dialog/submit-dialog.component';
import { TokenStorageService } from '@service/token/token-storage.service';
import { take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OverlayService } from '@service/overlay/overlay.service';
import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';
import { ComponentType } from '@angular/cdk/portal';
// @TODO: There are A LOT of things going on here (too many for just one component)
// We need to split this up thats one
// Two, a lot of this code is not necessary, let's refactor

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @ViewChild('editor') editor: AceEditorComponent;
  
  selectedLanguage: Language;
  codeSnippet = '';
  evaluationResult: boolean;

  text: string;

  taskSubscription: Subscription;
  languageSubscription: Subscription;
  task: Task;
  candidate: Candidate;
  codeResult: string;
  tests: boolean[];
  subscribeComponent = SubscribeComponent;
  
  constructor(
    private router: Router,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private taskService: TaskService,
    private languageService: LanguageService,
    private submissionService: SubmissionService,
    private tokenStorageService: TokenStorageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.resetTests();
    this.retrieveAndSetTask();
    this.retrieveAndSetLanguage();
  }

  ngAfterViewInit() {
    // TODO check if necessary
    // this.editor.setOptions({
    //   animatedScroll: true,
    //   showPrintMargin: false,
    //   tabSize: 2,
    //   useSoftTabs: true,
    // });
  }

  onChange = (event: any) => this.codeSnippet = event;

  evaluateCode = (): void => {
    const runCodeSubmission: Submission = {
      answer: this.codeSnippet,
      languageId: this.selectedLanguage.id,
      taskId: this.task.id
    };
    this.submissionService.runCode(runCodeSubmission).subscribe(
      response => this.handleSuccessfulResponseRunCode(response),
    );
  }

  handleSuccessfulResponseRunCode = (response): void => {
    // First we clear the current output for the new input
    this.codeResult = '';
    response.forEach(element => {
      // We check if it is not an error than we show the output, otherwise we show the error.
      console.log(element);
      if (element.errorType === null) {
        this.codeResult += element.contentValue;
      } else {
        this.codeResult += element.errorType;
        this.codeResult += '\n';
        this.codeResult += element.errorValue;
      }
    });
  }

  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);
  }

  submitCode = () => {
    // A Submission on the frontend has no id, correct array and personId. 
    // This is because these elements will be determined on the backend.
    const submission: Submission = {
      answer: this.codeSnippet,
      languageId: this.selectedLanguage.id,
      taskId: this.task.id
    };

    this.submissionService.createSubmission(submission).subscribe(
      response => {
        this.codeResult = '';
        this.tests = response;
        console.log('successful post message create submission');

        let index = 1;
        response.forEach(element => {
          const elementName = 'test' + index;
          const testDot = document.getElementById(elementName);

          if (element) {
            testDot.style.backgroundColor = 'green';
          } else {
            testDot.style.backgroundColor = 'red';
          }
          index += 1
        });
      }
    );
  }

  retrieveAndSetLanguage = (): void => {
    const languageParam = this.route.snapshot.paramMap.get('language'); 

    this.languageSubscription = this.languageService.getLanguagesMap().subscribe((languagesMap) => {
      this.selectedLanguage = languagesMap.get(languageParam);

      if (!this.selectedLanguage) {
        throw new Error(`No such language: ${languageParam}.`);
      } else {
        this.setBoilerPlateCode();
      }
    });
  }

  retrieveAndSetTask = (): void => {
    this.taskSubscription = this.route.firstChild.paramMap.pipe(
      switchMap(params => {
        let exerciseId = parseInt(params.get('id'));
        if (isNaN(exerciseId)) {
          exerciseId = 1; // simply assign 1 if there's a problem
        }

        // get the task with this id and switch to that Observable
        return this.taskService.getTask(exerciseId);
      })
    ).subscribe(task => {
      this.task = task;
      this.setBoilerPlateCode();
    });
  }

  setBoilerPlateCode = (): void => {
    let boilerplate: string = '';
    if (this.selectedLanguage && this.task) {
      // If both objects are filled we will set the boilerplate code
      if (this.selectedLanguage.language === 'java') {
        boilerplate = this.task.boilerplateJava;
      } else if (this.selectedLanguage.language === 'python') {
        boilerplate = this.task.boilerplatePython;
      } else if (this.selectedLanguage.language === 'javascript') {
        boilerplate = this.task.boilerplateJavascript;
      }
    }
    const lines = boilerplate.split('\\n');
    this.text = '\n';
    lines.forEach(line => {
      this.text += line;
      this.text += '\n';
    });
    this.codeSnippet = this.text;
  }

  goToTask = (taskNumber: number) => {
    console.log("going to task number " + taskNumber);
    this.router.navigateByUrl('challenge/' + this.selectedLanguage.language + '/' + taskNumber);
    this.resetTests();
    // there is no need to set the task and language again. I believe because of the subscription construction.
    // this.retrieveAndSetTask();
    // this.retrieveAndSetLanguage();
  }

  isTest = (testNumber): boolean => {
    // simple function to see how many tests should be displayed on the screen.
    if (this.task.taskNumber === 1) {
      // if it's the first task we want to show the first 5 test dots
      return testNumber <= 5;
    } else if (this.task.taskNumber === 2) {
      return testNumber <= 6;
    } else if (this.task.taskNumber === 3) {
      return testNumber <= 8;
    } else {
      return false;
    }
  }

  completeTask = (taskNumber): boolean => {
    if (this.task.taskNumber === 1 && taskNumber === 1) {
      // all 5 tests of the first task should be successful
      return this.tests[0] && this.tests[1] && this.tests[2] && this.tests[3] && this.tests[4];
    } else {
      // TODO: implement the progression for the second and third task.
      return false;
    }
  }

  finishedCodeChallenge = () => {
    console.log("The code challenge is completed");
  }

  checkIsLoggedIn = (): boolean => this.tokenStorageService.isUserLoggedIn();

  resetTests = () => {
    // reset the test array
    this.tests = [false, false, false, false, false, false, false, false, false, false];
    // refreshing the objects.
    let index = 1;
    this.tests.forEach(element => {
      const elementName = 'test' + index;
      let testDot = document.getElementById(elementName);
      if (testDot !== null) {
        testDot.style.backgroundColor="#bbb";
      }
      index += 1
    });
  }
  
  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }

}
