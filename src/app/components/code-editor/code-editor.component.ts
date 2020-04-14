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
import { TokenStorageService } from "@service/token/token-storage.service";
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
    private candidateService: CandidateService,
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
  loadJavaScriptTask: any;

  // These variables are used to create the submission object
  submissionLanguageId: number;
  submissionCandidateId: number;
  submissionTaskId: number;
  submission: Submission;

  taskDescription: string;
  subscribeComponent = SubscribeComponent;
  text = '';
  language = this.selectedLanguage;

  paramMapSubscription: Subscription;

  ngOnInit() {
    this.paramMapSubscription = this.route.paramMap.subscribe(params => {
      this.selectedLanguage = params.get('language');
      this.exerciseId = parseInt(params.get('id'));
    });

    this.selectedLanguageIsJavascript = this.selectedLanguage === 'javascript';
    this.selectedLanguageIsPython = this.selectedLanguage === 'python';
    this.selectedLanguageIsJava = this.selectedLanguage === 'java';
    this.loadJavaScriptTask = this.selectedLanguageIsJavascript;

    // We load the task based on the exerciseId
    this.getTask();
  }

  ngAftterViewInit() {
    this.editor.setOptions({
      animatedScroll: true,
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
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
  };

  // TODO: Implement Jupyter connection
  evaluateCode = (language: string): boolean => this.evaluationResult = true;

  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);
  };

  getTask = (): void => {
    this.taskService.getTask(this.exerciseId).subscribe(
      response => this.handleSuccessfulResponseGetTask(response),
    );
  };

  getLanguage = (): void => {
    this.languageService.getLanguages().subscribe(
      response => this.handleSuccessfulResponseGetLanguage(response),
    );
  };

  createSubmission = (): void => {
    // When creating a new Submission we give id null so it creates a new entry. It will determine the id by itself.
    this.submission = {
      id: null,
      answer: this.codeSnippet,
      correct: false,
      personId: this.submissionCandidateId,
      languageId: this.submissionLanguageId,
      taskId: this.submissionTaskId
    };

    this.submissionService.createSubmission(this.submission).subscribe(
      response => this.handleSuccessfulResponseCreateSubmission(response),
    );
  };


  handleSuccessfulResponseCreateCandidate = (response): void => {
    const { id } = response;
    this.submissionCandidateId = id;
  };

  handleSuccessfulResponseGetTask = (response): void => {
    // We receive the task object from the backend and we need the id and the description.
    const { id, description } = response;
    this.submissionTaskId = id;
    this.taskDescription = description;
  };

  handleSuccessfulResponseGetLanguage = (response): void => {
    const { id } = response;
    this.submissionLanguageId = id;
    // Finally we want to find the task that candidate has performed to create the final submission to send.
    this.createSubmission();
  };

  handleSuccessfulResponseCreateSubmission = (response): void => {
    // TODO: do something with a successful response
    console.log('successful post message create submission');
  };

  ngOnDestroy() {
    this.paramMapSubscription.unsubscribe();
  }

  getTaskDescription = () => this.taskDescription;

  submitCode = (): void => {
    console.log("submit code");
  };

  checkLogin = (): boolean => {
    return this.tokenStorageService.isUserLoggedIn();
  };
}
