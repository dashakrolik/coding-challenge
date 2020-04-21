import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute } from '@angular/router';
import { SubscribeComponent } from '../overlay/subscribe/subscribe.component';

import { TaskService } from '@service/task/task.service';
import { SubmissionService } from '@service/submission/submission.service';
import { LanguageService } from '@service/language/language.service';
import { OverlayService } from '@service/overlay/overlay.service';
import { TokenStorageService } from '@service/token/token-storage.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
// @TODO: There are A LOT of things going on here (too many for just one component)
// We need to split this up thats one
// Two, a lot of this code is not necessary, let's refactor

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent implements OnInit, OnDestroy {
  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private overlayService: OverlayService,
    private taskService: TaskService,
    private languageService: LanguageService,
    private submissionService: SubmissionService,
    private tokenStorageService: TokenStorageService
  ) {
    this.route = route;
  }

  @ViewChild('editor') editor: AceEditorComponent;

  selectedLanguage: string;
  exerciseId: number;
  codeSnippet = '';
  selectedLanguageIsJavascript: boolean;
  selectedLanguageIsPython: boolean;
  selectedLanguageIsJava: boolean;
  evaluationResult: boolean;

  // These variables are used to create the submission object
  submissionLanguageId: number;
  submissionTaskId: number;
  submission: Submission;

  taskDescription: string;
  subscribeComponent = SubscribeComponent;
  text = '';
  language = this.selectedLanguage;

  paramSubscription: Subscription;
  codeResult: string;
  tests: boolean[];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = params.get('language');
    });
    this.route.firstChild.paramMap.subscribe(params => {
      this.exerciseId = parseInt(params.get('id'));
    });

    this.selectedLanguageIsJavascript = this.selectedLanguage === 'javascript';
    this.selectedLanguageIsPython = this.selectedLanguage === 'python';
    this.selectedLanguageIsJava = this.selectedLanguage === 'java';
    this.codeResult = '';
    this.tests = [false, false, false, false, false, false, false, false, false, false];

    // We load the task based on the exerciseId
    this.getTask();
    this.getLanguage();
  }

  ngAftterViewInit() {
    this.editor.setOptions({
      animatedScroll: true,
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true
    });
  }

  onChange = (event: any) => this.codeSnippet = event;

  // @TODO refactor the code below
  setLanguageOptions = (option: string): string => {
    const isJavascriptMode = option === 'mode' && this.selectedLanguageIsJavascript;
    const isPythonMode = option === 'mode' && this.selectedLanguageIsPython;
    const isJavaMode = option === 'mode' && this.selectedLanguageIsJava;
    const isJavascriptTheme = option === 'theme' && this.selectedLanguageIsJavascript;
    const isPythonTheme = option === 'theme' && this.selectedLanguageIsPython;
    const isJavaTheme = option === 'theme' && this.selectedLanguageIsJava;

    switch (true) {
      case (isJavascriptMode):
        return 'javascript';
      case (isPythonMode):
        return 'python';
      case (isJavaMode):
        return 'java';
      case (isJavascriptTheme):
        return 'dracula';
      case (isPythonTheme):
        return 'monokai';
      case (isJavaTheme):
        return 'eclipse';
    }
  }

  runCode = (): boolean => {
    switch (true) {
      case this.selectedLanguageIsJavascript:
        return this.evaluateCode('javascript');
      case this.selectedLanguageIsPython:
        return this.evaluateCode('python');
      case this.selectedLanguageIsJava:
        return this.evaluateCode('java');
    }
  }

  evaluateCode = (language: string): boolean => {
    const runCodeSubmission: Submission = {
      answer: this.codeSnippet,
      languageId: this.submissionLanguageId,
      taskId: this.submissionTaskId
    };
    this.submissionService.runCode(runCodeSubmission).subscribe(
      response => this.handleSuccessfulResponseRunCode(response),
    );

    this.evaluationResult = true;
    return this.evaluationResult;
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

  getTask = (): void => {
    this.taskService.getTask(this.exerciseId).subscribe(
      response => this.handleSuccessfulResponseGetTask(response),
    );
  }

  getLanguage = (): void => {
    this.languageService.getLanguageId(this.selectedLanguage).subscribe(
      response => this.handleSuccessfulResponseGetLanguage(response),
    );
  }

  handleSuccessfulResponseGetLanguage = (response): void => {
    this.submissionLanguageId = response.id;
  }

  createSubmission = (): void => {
    this.submission = {
      answer: this.codeSnippet,
      languageId: this.submissionLanguageId,
      taskId: this.submissionTaskId
    };

    this.submissionService.createSubmission(this.submission).subscribe(
      response => this.handleSuccessfulResponseCreateSubmission(response),
    );
  }

  parseNewLinesFromText = (boilerplate): void => {
    // The newlines are not correctly taken over by the regex. We will loop over each line to ensure a correct syntax
    const lines = boilerplate.split('\\n');
    this.text = '\n';
    lines.forEach(line => {
      this.text += line;
      this.text += '\n';
    });
    this.codeSnippet = this.text;
  }

  handleSuccessfulResponseGetTask = (response): void => {
    // We receive the task object from the backend and we need the id, the description and the boilerplate for the code.
    const { id, description, boilerplateJava, boilerplatePython, boilerplateJavascript } = response;
    if (this.selectedLanguage === 'java') {
      this.parseNewLinesFromText(boilerplateJava);
    } else if (this.selectedLanguage === 'python') {
      this.parseNewLinesFromText(boilerplatePython);
    } else if (this.selectedLanguage === 'javascript') {
      this.parseNewLinesFromText(boilerplateJavascript);
    }
    this.submissionTaskId = id;
    this.taskDescription = description;
  }

  handleSuccessfulResponseCreateSubmission = (response): void => {
    this.codeResult = '';
    console.log('successful post message create submission');
    // The response will be a boolean array of the tests and if they failed or not.
    this.tests = response;
    let index = 1;

    this.tests.forEach(element => {
      const elementName = 'test' + index;

      const testDot = document.getElementById(elementName);

      if (element) {
        testDot.style.backgroundColor = 'green';
        this.tests[index] = true;
      } else {
        testDot.style.backgroundColor = 'red';
        this.tests[index] = false;
      }
      index += 1
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  submitCode = (): void => {
    // This code is called when it is confirmed that the user is logged in
    // We should have the language id. quick test to see if a language id is set.
    if (this.submissionLanguageId !== null) {
      this.createSubmission();
    }
  }

  checkLogin = (): boolean => this.tokenStorageService.isUserLoggedIn();

  completeTask = (taskNumber): boolean => {
    // Now it just check if the 2 tests I have added are correct. change this with the final test implementation
    if (this.exerciseId === taskNumber) {
      // all 5 tests of the first task should be successful
      return this.tests[0] && this.tests[1] && this.tests[2] && this.tests[3] && this.tests[4];
    } else {
      // TODO: implement the progression for the second and third task.
      return false;
    }
  }

  isTest = (testNumber): boolean => {
    // simple function to see how many tests should be displayed on the screen.
    if (this.exerciseId === 1) {
      // if it's the first task we want to show the first 5 test dots
      return testNumber <= 5;
    } else if (this.exerciseId === 2) {
      return testNumber <= 6;
    } else if (this.exerciseId === 3) {
      return testNumber <= 8;
    } else {
      return false;
    }
  }

  goToTask = (taskNumber: number) => {
    console.log("going to task number " + taskNumber);
    this.router.navigateByUrl('challenge/' + this.selectedLanguage + '/' + taskNumber);
    // reset the test array
    this.tests = [false, false, false, false, false, false, false, false, false, false];
    // refreshing the objects.
    let index = 1;
    this.tests.forEach(element => {
      const elementName = 'test' + index;
      let testDot = document.getElementById(elementName);
      testDot.style.backgroundColor="#bbb";
      index += 1
    });
    this.exerciseId = taskNumber;
    this.getTask();
    this.getLanguage();
  }

  finishedCodeChallenge = () => {
    console.log("The code challenge is completed");
  }
}
