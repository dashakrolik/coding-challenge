import { Component, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscribeComponent } from '../overlay/subscribe/subscribe.component';
import { CandidateService } from '@service/candidate/candidate.service';
import { TaskService } from '@service/task/task.service';
import { SubmissionService } from '@service/submission/submission.service';
import { LanguageService } from '@service/language/language.service';
import { OverlayService } from '@service/overlay/overlay.service';
import { TokenStorageService } from '@service/token/token-storage.service';
import { Subscription } from 'rxjs';
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
      this.exerciseId = parseInt(params.get("id"));
    });

    this.selectedLanguageIsJavascript = this.selectedLanguage === 'javascript';
    this.selectedLanguageIsPython = this.selectedLanguage === 'python';
    this.selectedLanguageIsJava = this.selectedLanguage === 'java';
    this.codeResult = '';

    // We load the task based on the exerciseId
    this.getTask();
    this.getLanguage();
    this.tests = [false, false, false, false, false, false, false, false, false, false, false];
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
    // TODO: check if there is an error and print that instead of the normal contentvalue.
    this.codeResult = "";
    response.forEach(element => {
      this.codeResult += element.contentValue;
      console.log(element);
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
    this.codeResult = "";
    console.log('successful post message create submission');
    let index = 1;
    response.forEach(element => {
      const elementName = 'test' + index;
      let testDot = document.getElementById(elementName);
      if (element) {
        testDot.style.backgroundColor="green"
        this.tests[index] = true;
      } else {
        testDot.style.backgroundColor="red"
        this.tests[index] = false;
      }
      index += 1
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  getTaskDescription = () => this.taskDescription;

  submitCode = (): void => {
    // This code is called when it is confirmed that the user is logged in
    // We should have the language id. quick test to see if a language id is set.
    if (this.submissionLanguageId !== null) {
      this.createSubmission();
    }
  }

  checkLogin = (): boolean => this.tokenStorageService.isUserLoggedIn();

  completeTask = (taskNumber): boolean => {
    // TODO: implement the complete task check
    // Now it just check if the 2 tests I have added are correct. change this with the final test implementation
    let completedTests = 0;
    this.tests.forEach( test => {
      if (test) {
        completedTests += 1;
      }
    });
    if (completedTests === 5) {
      return true;
    } else {
      return false;
    }
  }

  goToTask = (taskNumber) => {
    console.log('going to task number ' + taskNumber);
  }
}
