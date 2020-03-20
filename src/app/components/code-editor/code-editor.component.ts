import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute, Router } from '@angular/router'
import { SubscribeComponent } from "../overlay/subscribe/subscribe.component";
import { OverlayService } from "../../service/overlay/overlay.service";
import { ComponentType } from "@angular/cdk/portal";
import { Candidate } from "../candidate/Candidate";
import { HttpClientService } from "../../service/http/http-client.service";
import { Submission } from "./Submission";
import { Task } from "./Task";
import { Language } from "./Language";

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent {
  public constructor(
    private route:ActivatedRoute,
    private router:Router,
    private overlayService: OverlayService,
    private httpClientService: HttpClientService
  ) {
    this.route = route;
  }

  selectedLanguage: string;
  exerciseId: any;
  codeSnippet = '';
  selectedLanguageIsJavascript: boolean
  selectedLanguageIsPython: boolean
  selectedLanguageIsJava: boolean
  evaluationResult: boolean

  // These variables are used to create the submission object
  submissionLanguage: Language;
  submissionCandidate: Candidate;
  submissionTask: Task;


  ngOnInit() {
    this.route.paramMap.subscribe(language =>
      this.selectedLanguage = language.get("language")
      )
    this.exerciseId = this.route.firstChild.snapshot.params['id']
    this.selectedLanguageIsJavascript = this.selectedLanguage === 'javascript'
    this.selectedLanguageIsPython = this.selectedLanguage === 'python'
    this.selectedLanguageIsJava = this.selectedLanguage === 'java'
  }

  @ViewChild('editor') editor: AceEditorComponent;
  text = '';
  language = this.selectedLanguage;
  loadJavascriptTask = false;

  ngAftterViewInit() {
    this.editor.setOptions({
      animatedScroll: true,
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
    })
  }

  onChange = (event: any) => {
    this.codeSnippet = event;
  }

  setLanguageOptions (option: string) {
    let isJavascriptMode = option === 'mode' && this.selectedLanguageIsJavascript
    let isPythonMode = option === 'mode' && this.selectedLanguageIsPython
    let isJavaMode = option === 'mode' && this.selectedLanguageIsJava
    let isJavascriptTheme = option === 'theme' && this.selectedLanguageIsJavascript
    let isPythonTheme = option === 'theme' && this.selectedLanguageIsPython
    let isJavaTheme = option === 'theme' && this.selectedLanguageIsJava

    switch (true)  {
      case (isJavascriptMode):
        this.isJavascriptTest()
        return 'javascript'
      case (isPythonMode):
        return 'python'
      case (isJavaMode):
        return 'java'
      case (isJavascriptTheme ):
        return 'dracula'
      case (isPythonTheme):
        return 'monokai'
      case (isJavaTheme ):
        return 'eclipse'
    }
  }

 isJavascriptTest() {
    if (this.selectedLanguageIsJavascript) {
      this.loadJavascriptTask = true;
    } else {
      this.loadJavascriptTask = false;
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

  evaluateCode(language) {
    //TODO: Implement Jupyter connection
    console.log(`submit code in ${language}`)
    console.log(`submitted code ${this.codeSnippet}`)
    return this.evaluationResult = true
  }

  subscribeComponent = SubscribeComponent;

  openModal(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      console.log('res', res.data)
      // simple check to see if the user cancelled the form.
      if (res.data != null && this.evaluationResult) {
        // We will create a submission. To do this we must first create the new candidate and retrieve other data
        // Create a new candidate, for now it has a placeholder for first name and last name.
        // Id is not necessary, it will create an id automatically in the backend.
        // TODO: instead of creating it and retrieving it we want to add a user login possibility
        let newCandidate = new Candidate(1, res.data.firstName, res.data.lastName, res.data.email);
        this.httpClientService.createCandidate(newCandidate).subscribe(
          response => this.handleSuccessfulResponseCreateCandidate(response),
        );
      }
    });
  }

  getTask() {
    // TODO: retrieve the correct task with the given task and get the correct id for the task object.
    // TODO: Not implemented! - No task yet implemented. It will return the first task in the database.
    this.httpClientService.getTask("nothing").subscribe(
      response => this.handleSuccessfulResponseGetTask(response),
    );

  }

  getLanguage() {
    console.log("this.selectedLanguage " + this.selectedLanguage);
    this.httpClientService.getLanguage(this.selectedLanguage).subscribe(
      response => this.handleSuccessfulResponseGetLanguage(response),
    );
  }

  handleSuccessfulResponseCreateSubmission(response) {
    // TODO: do something with a successful response
    console.log("successful post message create submission");
  }

  createSubmission() {
    let answer = this.codeSnippet;
    let submission = new Submission(1, answer, false, this.submissionCandidate, this.submissionLanguage, this.submissionTask);
    this.httpClientService.createSubmission(submission).subscribe(
      response => this.handleSuccessfulResponseCreateSubmission(response),
    );
  }

  handleSuccessfulResponseGetTask(response) {
    console.log("successful post message get task");
    let taskId = response.id;
    let taskDescription = response.task;
    this.submissionTask = new Task(taskId, taskDescription);

    this.createSubmission();
  }

  handleSuccessfulResponseGetLanguage(response) {
    console.log("successful post message get language");
    let languageId = response.id;
    let languageName = response.language;
    this.submissionLanguage = new Language(languageId, languageName);

    // Finally we want to find the task that candidate has performed to create the final submission to send.
    this.getTask();
  }

  handleSuccessfulResponseCreateCandidate(response) {
    console.log("successful post message create candidates");
    let candidateId = response.id;
    let candidateFirstName = response.firstName;
    let candidateLastName = response.lastName;
    let candidateEmail = response.email;
    this.submissionCandidate = new Candidate(candidateId, candidateFirstName, candidateLastName, candidateEmail);

    // To create the submission we also need to know which language the user Candidate is using.
    this.getLanguage();
  }
}

