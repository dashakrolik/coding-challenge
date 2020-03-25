import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute, Router } from '@angular/router'
import { SubscribeComponent } from "../overlay/subscribe/subscribe.component";
import { OverlayService } from "../../service/overlay/overlay.service";
import { ComponentType } from "@angular/cdk/portal";
import { HttpClientService } from "../../service/http/http-client.service";

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent {
  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private overlayService: OverlayService,
    private httpClientService: HttpClientService
  ) {
    this.route = route;
  }

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

  // The Task description
  taskDescription: string;

  ngOnInit() {
    this.route.paramMap.subscribe(language =>
      this.selectedLanguage = language.get("language")
    );
    this.exerciseId = this.route.firstChild.snapshot.params['id'];
    this.selectedLanguageIsJavascript = this.selectedLanguage === 'javascript';
    this.selectedLanguageIsPython = this.selectedLanguage === 'python';
    this.selectedLanguageIsJava = this.selectedLanguage === 'java';
    this.loadJavaScriptTask = this.selectedLanguageIsJavascript;

    // We load the task based on the exerciseId
    this.getTask()
  }

  @ViewChild('editor') editor: AceEditorComponent;
  text = '';
  language = this.selectedLanguage;

  ngAftterViewInit() {
    this.editor.setOptions({
      animatedScroll: true,
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
    })
  }

  onChange(event: any) {
    this.codeSnippet = event;
  };

  setLanguageOptions(option: string) {
    let isJavascriptMode = option === 'mode' && this.selectedLanguageIsJavascript;
    let isPythonMode = option === 'mode' && this.selectedLanguageIsPython;
    let isJavaMode = option === 'mode' && this.selectedLanguageIsJava;
    let isJavascriptTheme = option === 'theme' && this.selectedLanguageIsJavascript;
    let isPythonTheme = option === 'theme' && this.selectedLanguageIsPython;
    let isJavaTheme = option === 'theme' && this.selectedLanguageIsJava;

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
        return 'eclipse'
    }
  }

  runCode() {
    switch (true) {
      case this.selectedLanguageIsJavascript:
        return this.evaluateCode('javascript')
      case this.selectedLanguageIsPython:
        return this.evaluateCode('python')
      case this.selectedLanguageIsJava:
        return this.evaluateCode('java')
    }
  };

  evaluateCode(language: string) {
    //TODO: Implement Jupyter connection
    console.log(`submit code in ${language}`)
    console.log(`submitted code ${this.codeSnippet}`)
    return this.evaluationResult = true
  }

  subscribeComponent = SubscribeComponent;

  openModal(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      // simple check to see if the user cancelled the form and code is evaluated
      if (res.data != null && this.evaluationResult) {
        console.log('fields not empty and code is evaluated')
        // We will create a submission. To do this we must first create the new candidate and retrieve other data
        // Create a new candidate, for now it has a placeholder for first name and last name.
        // Id should be null. It will create an id automatically in the backend if it is null.
        // TODO: instead of creating it and retrieving it we want to add a user login possibility
        // TODO: Now we retrieve the task and the language. Later this should be retrieved already,
        //  remove this at that point.

        const candidate = {
          id: null,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email
        };

        this.httpClientService.createCandidate(candidate).subscribe(
          response => this.handleSuccessfulResponseCreateCandidate(response),
        );
      } else {
        console.log('Check fields and code')
      }
    });
  }

  getTask = (): void => {
    console.log("getting task with task number " + this.exerciseId);
    this.httpClientService.getTask(this.exerciseId).subscribe(
      response => this.handleSuccessfulResponseGetTask(response),
    );
  };

  getLanguage = (): void => {
    // TODO: The language should be loaded already when entering this page. Remove this part when that is done.
    this.httpClientService.getLanguage(this.selectedLanguage).subscribe(
      response => this.handleSuccessfulResponseGetLanguage(response),
    );
  };

  createSubmission = (): void => {
    // When creating a new Submission we give id null so it creates a new entry. It will determine the id by itself.
    this.submission = {
      id: null,
      answer: this.codeSnippet,
      correct: false,
      candidateId: this.submissionCandidateId,
      languageId: this.submissionLanguageId,
      taskId: this.submissionTaskId
    };

    this.httpClientService.createSubmission(this.submission).subscribe(
      response => this.handleSuccessfulResponseCreateSubmission(response),
    );
  };


  handleSuccessfulResponseCreateCandidate = (response): void => {
    console.log("successful post message create candidates");

    const { id, firstName, lastName, email } = response;
    this.submissionCandidateId = id;

    // To create the submission we also need to know which language the user Candidate is using.
    this.getLanguage();
  };

  handleSuccessfulResponseGetTask = (response): void => {
    console.log("successful post message get task");

    // We receive the task object from the backend and we need the id and the description.
    const { id, description, taskNumber } = response;
    this.submissionTaskId = id;
    this.taskDescription = description
  };

  handleSuccessfulResponseGetLanguage = (response): void => {
    console.log("successful post message get language");

    const { id, language } = response;
    this.submissionLanguageId = id;

    // Finally we want to find the task that candidate has performed to create the final submission to send.
    this.createSubmission();
  };

  handleSuccessfulResponseCreateSubmission = (response): void => {
    // TODO: do something with a successful response
    console.log("successful post message create submission");
  };

  getTest() {
    return this.taskDescription;
  }
}
