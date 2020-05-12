import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';

import { AceEditorComponent } from 'ng2-ace-editor';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { CandidateService } from '@services/candidate/candidate.service';
import { SubmissionService } from '@services/submission/submission.service';
import { TaskService } from '@services/task/task.service';
import { LanguageService } from '@services/language/language.service';
import { TokenStorageService } from '@services/token/token-storage.service';
import { OverlayService } from '@services/overlay/overlay.service';

import { SubmitDialogComponent } from '@components/submit-dialog/submit-dialog.component';
import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';

// TODO: There are A LOT of things going on here (too many for just one component)
// We need to split this up thats one
// Two, a lot of this code is not necessary, let's refactor

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('editor') editor: AceEditorComponent;

  selectedLanguage: ILanguage;
  codeSnippet = '';
  evaluationResult: boolean;
  taskIsAllowed: boolean;

  text: string;

  taskSubscription: Subscription;
  languageSubscription: Subscription;
  codeResult: any;
  tests: boolean[];
  subscribeComponent = SubscribeComponent;

  taskSpecificDescription: string;
  submissionSubscription: Subscription;
  task: ITask;
  candidate: ICandidate;
  output: any;

  constructor(
    private router: Router,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private taskService: TaskService,
    private languageService: LanguageService,
    private submissionService: SubmissionService,
    private tokenStorageService: TokenStorageService,

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

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }

  onChange = (event: any) => this.codeSnippet = event;

   evaluateCode = async () => {
    // Fill the 'codeResult' in the 'evaluateCode' function.
    const runCodeSubmission: ISubmission = {
      answer: this.codeSnippet,
      languageId: this.selectedLanguage.id,
      taskId: this.task.id,
      correct: [],
      runningTime: 0
    };
    console.log('evaluating code');
    await this.submissionService.runCode(runCodeSubmission).toPromise().then(response => {
      this.codeResult = '';
      response.forEach(line => {
        console.log(line);
        if (line.errorType === null ) {
          this.codeResult += line.contentValue;
        } else {
          this.codeResult += line.errorType;
          this.codeResult += '\n';
          this.codeResult += line.errorValue;
        }
      });
    });
    console.log(this.codeResult);
  }

  languageToId = (selectedLanguage) :number => {
    if(selectedLanguage === 'java') {
      return 1
    }
    if(selectedLanguage === 'python') {
      return 2
    }
    if(selectedLanguage === 'javascript') {
      return 3
    }
  }

  taskView = (routeId): void => {
    let overalCheckArray = []

    // Define previous task 
    let previousTask = routeId -1

    // It's always allowed to go to the first task
    if (previousTask < 1) {
      this.taskIsAllowed = true 
    } 
    // Get all submissions
    this.submissionService.getAllSubmissionsProfile().pipe(take(1)).subscribe(submissions => {
      // Filter out all submissions from previous task
      let previousTaskSubmissions = submissions.filter(task => 
        task.taskId === previousTask    
        )
        // Check if there are any submissions and a language is selected
        if (previousTaskSubmissions.length > 0 && this.selectedLanguage) {      
          // Filter out selectedLanguage
          let selectedLanguageSubmissions = previousTaskSubmissions.filter(selectedLanguage => 
            selectedLanguage.languageId === this.languageToId(this.selectedLanguage.language))
            
          // Filter out the array of checked answers
          let isAllowed = selectedLanguageSubmissions.map(submission => submission.correct)
          
          isAllowed.forEach(function (submissionSet) {
            // Return true if all answes of a submission are correct and put those booleans in an Array
            overalCheckArray.push(submissionSet.every(check => check))
          })
          // Check if at least one submission only has correct answers  
          this.taskIsAllowed = overalCheckArray.includes(true) 
      }
    });
  }


  handleSuccessfulResponseRunCode = (response): void => {
    // First we clear the current output for the new input
    // TODO This is not called anymore. fill the 'codeResult' in the 'evaluateCode' function
    this.codeResult = '';
    console.log('run2', response);
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
    if (!this.checkIsLoggedIn()) {
      this.loginWindow(this.subscribeComponent);
    } else {
      // A Submission on the frontend has no id, correct array and personId.
      // This is because these elements will be determined on the backend.
      const submission: ISubmission = {
        answer: this.codeSnippet,
        languageId: this.selectedLanguage.id,
        taskId: this.task.id,
        correct: [],
        runningTime: 0
      };

      this.submissionService.createSubmission(submission).subscribe(
        response => {
          this.codeResult = '';
          this.tests = response;
          console.log('successful post message create submission');
        }
      );
    }
  }

  retrieveAndSetLanguage = (): void => {
    const languageParam = this.route.snapshot.paramMap.get('language');

    this.languageSubscription = this.languageService.getLanguagesMap().subscribe((languagesMap) => {
      this.selectedLanguage = languagesMap.get(languageParam);
      this.setBoilerPlateCode();
      // if (!this.selectedLanguage) {
      //   throw new Error(`No such language: ${languageParam}.`);
      // } else {
      //   this.setBoilerPlateCode();
      // }
    });
  }

  retrieveAndSetTask = (): void => {
    this.taskSubscription = this.route.firstChild.paramMap.pipe(
      switchMap(params => {
        let exerciseId = parseInt(params.get('id'));
        if (isNaN(exerciseId)) {
          exerciseId = 1; // simply assign 1 if there's a problem
        }
        //Check if user is allowed to view visited task of selected language
        this.taskView(exerciseId)
        // get the task with this id and switch to that Observable
        return this.taskService.getTask(exerciseId);
      })
    ).subscribe((task: ITask) => {
      this.task = task;

      this.setBoilerPlateCode();
    });
  }

  setBoilerPlateCode = (): void => {
    let boilerplate = '';
    if (this.selectedLanguage && this.task) {
      // If both objects are filled we will set the boilerplate code
      if (this.selectedLanguage.language === 'java') {
        boilerplate = this.task.boilerplateJava;
        this.taskSpecificDescription = this.task.descriptionJava;
      } else if (this.selectedLanguage.language === 'python') {
        boilerplate = this.task.boilerplatePython;
        this.taskSpecificDescription = this.task.descriptionPython;
      } else if (this.selectedLanguage.language === 'javascript') {
        boilerplate = this.task.boilerplateJavascript;
        this.taskSpecificDescription = this.task.descriptionJavascript;
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
    console.log('going to task number ' + taskNumber);
    this.router.navigateByUrl('challenge/' + this.selectedLanguage.language + '/' + taskNumber);
    this.resetTests();
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

  // Map over this instead of hard coding, this is not readable
  completeTask = (taskNumber): boolean => {
    if (this.task.taskNumber === taskNumber) {
      let checker = arr => arr.every(v => v === true);
      return checker(this.tests)
    } else {
      return false;
    }
  }

  finishedCodeChallenge = () => {
    console.log('The code challenge is completed');
  }

  checkIsLoggedIn = (): boolean => this.tokenStorageService.isUserLoggedIn();

  resetTests = () => {
    console.log("resetting");
    // reset the test array
    this.tests = [false, false, false, false, false, false, false, false, false, false];
  }

}
