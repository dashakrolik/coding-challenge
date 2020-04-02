import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscribeComponent } from '../overlay/subscribe/subscribe.component';
import { OverlayService } from '@service/overlay/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { HttpClientService } from '@service/http/http-client.service';
import { TokenStorageService } from "../../service/token/token-storage.service";

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent implements OnInit {

  public constructor(
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private httpClientService: HttpClientService,
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

  ngOnInit() {
    this.route.paramMap.subscribe(language =>
      this.selectedLanguage = language.get('language')
    );
    this.exerciseId = this.route.firstChild.snapshot.params.id;
    this.selectedLanguageIsJavascript = this.selectedLanguage === 'javascript';
    this.selectedLanguageIsPython = this.selectedLanguage === 'python';
    this.selectedLanguageIsJava = this.selectedLanguage === 'java';
    this.loadJavaScriptTask = this.selectedLanguageIsJavascript;

    // We load the task based on the exerciseId
    this.getTask();
    this.getLanguage();
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

  setLanguageOptions(option: string) {
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

  runCode = () => {
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
  evaluateCode = (language: string) => this.evaluationResult = true;

  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      // The user clicked away, so don't do anything.
    })
  };

  getTask = (): void => {
    this.httpClientService.getTask(this.exerciseId).subscribe(
      response => this.handleSuccessfulResponseGetTask(response),
    );
  };

  getLanguage() {
    // await has no effect on this type of expression (Observable)
    this.httpClientService.getLanguage().subscribe(
      response => {
        this.submissionLanguageId = null;
        response.forEach(element => {
          if (this.selectedLanguage === element.language) {
            this.submissionLanguageId = element.id;
          }
        });
      }
    );
  }

  createSubmission = (): void => {
    // When creating a new Submission we give id null so it creates a new entry. It will determine the id by itself.
    // The candidateId is left empty. The candidate is taken from the authorization token that will be send along.
    this.submission = {
      answer: this.codeSnippet,
      correct: false,
      languageId: this.submissionLanguageId,
      taskId: this.submissionTaskId
    };

    console.log("quick test zoveel");
    console.log(this.submission);
    this.httpClientService.createSubmission(this.submission).subscribe(
      response => this.handleSuccessfulResponseCreateSubmission(response),
    );
  }

  handleSuccessfulResponseGetTask = (response): void => {
    // We receive the task object from the backend and we need the id and the description.
    const { id, description } = response;
    this.submissionTaskId = id;
    this.taskDescription = description;
  };

  handleSuccessfulResponseCreateSubmission = (response): void => {
    // TODO: do something with a successful response
    console.log('successful post message create submission');
  };

  getTaskDescription = () => this.taskDescription;

  submitCode() {
    // This code is called when it is confirmed that the user is logged in
    // We should have the language id. quick test to see if a language id is set.
    if (this.submissionLanguageId !== null) {
      this.createSubmission();
    }
  }

  checkLogin() {
    return this.tokenStorageService.isUserLoggedIn();
  }
}
