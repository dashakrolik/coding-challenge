import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AceEditorComponent} from 'ng2-ace-editor';
import {ActivatedRoute, Router} from '@angular/router'
import {SubscribeComponent} from "../overlay/subscribe/subscribe.component";
import {OverlayService} from "../../service/overlay/overlay.service";
import {ComponentType} from "@angular/cdk/portal";
import {HttpClientService} from "../../service/http/http-client.service";

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
  exerciseId: any;
  codeSnippet = '';

  // These variables are used to create the submission object
  submissionLanguageId: number;
  submissionCandidateId: number;
  submissionTaskId: number;
  submission: Submission;

  ngOnInit() {
    this.route.paramMap.subscribe(language =>
      this.selectedLanguage = language.get("language")
    );
    this.exerciseId = this.route.firstChild.snapshot.params['id']
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
  };

  setLanguageMode() {
    if (this.selectedLanguage === 'javascript') {
      this.loadJavascriptTask = true;
      return 'javascript';
    }

    if (this.selectedLanguage === 'java') {
      return 'java';
    }

    if (this.selectedLanguage === 'python') {
      return 'python';
    }
  }

  setLanguageTheme() {
    if (this.selectedLanguage === 'javascript') {
      return 'dracula';
    }

    if (this.selectedLanguage === 'java') {
      return 'eclipse';
    }

    if (this.selectedLanguage === 'python') {
      return 'monokai';
    }
  }

  isJavascriptTest() {
    if (this.selectedLanguage === 'javascript') {
      this.loadJavascriptTask = true;
    } else {
      this.loadJavascriptTask = false;
    }
  }

  run = () => {
    switch (this.selectedLanguage) {
      case 'javascript':
        // tslint:disable-next-line: no-eval
        eval(this.codeSnippet);
        break;

      case 'java':
        console.log('java');
        break;

      case 'python':
        console.log('python');
        break;
      default: return
    }

  };

  subscribeComponent = SubscribeComponent;

  open(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      // simple check to see if the user cancelled the form.
      if (res.data != null) {
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
      }
    });
  }

  getTask = (): void => {
    // TODO: retrieve the correct task with the given task and get the correct id for the task object.
    // TODO: Not implemented! - No task yet implemented. It will return the first task in the database.
    this.httpClientService.getTask("nothing").subscribe(
      response => this.handleSuccessfulResponseGetTask(response),
    );
  };

  getLanguage = (): void => {
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

    // We receive the task object from the backend and we need the id.
    // TODO: When leading the task from the backend keep the id stored so we don't have to retrieve it here.
    const { id, task } = response;
    this.submissionTaskId = id;

    this.createSubmission();
  };

  handleSuccessfulResponseGetLanguage = (response): void => {
    console.log("successful post message get language");

    const { id, language } = response;
    this.submissionLanguageId = id;

    // Finally we want to find the task that candidate has performed to create the final submission to send.
    this.getTask();
  };

  handleSuccessfulResponseCreateSubmission = (response): void => {
    // TODO: do something with a successful response
    console.log("successful post message create submission");
  };
}
