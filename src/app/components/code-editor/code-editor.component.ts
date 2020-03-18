import {Component, TemplateRef, ViewChild} from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute, Router } from '@angular/router'
import {SubscribeComponent} from "../overlay/subscribe/subscribe.component";
import {OverlayService} from "../../service/overlay/overlay.service";
import {ComponentType} from "@angular/cdk/portal";
import {Candidate} from "../candidate/Candidate";
import {HttpClientService} from "../../service/http/http-client.service";
import {Submission} from "./Submission";
import {Task} from "./Task";
import {Language} from "./Language";

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

  selectedLanguage: string
  exerciseId: any
  codeSnippet = '';

  ngOnInit() {
    this.route.paramMap.subscribe(language =>
      this.selectedLanguage = language.get("language")
      )
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
  }

  setLanguageMode() {
    if (this.selectedLanguage === 'javascript') {
      this.loadJavascriptTask = true;
      return 'javascrip';
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

  }

  subscribeComponent = SubscribeComponent;

  open(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      console.log("subscribing new user, first name: " + res.data.firstName + " last name: " + res.data.lastName + " email: " + res.data.email);
      // Create a new candidate, for now it has a placeholder for first name and last name.
      // Id is not necessary, it will create an id automatically in the backend.
      let candidate = new Candidate(1, res.data.firstName, res.data.lastName, res.data.email);
      // this.httpClientService.createCandidate(candidate).subscribe(
      //   response => this.handleSuccessfulResponseCreateCandidate(response),
      // );

      let task = new Task(1, "do a task");
      let language = new Language(1, "Nederlands");

      let submission = new Submission(1, "answer", false, candidate, language, task);
      console.log("submission");
      this.httpClientService.createSubmission(submission).subscribe(
        response => this.handleSuccessfulResponseCreateSubmission(response),
      );

    });
  }

  handleSuccessfulResponseCreateSubmission(response) {
    // TODO: do something with a successful response
    console.log("successful post message create submission");
  }

  handleSuccessfulResponseCreateCandidate(response) {
    // TODO: do something with a successful response
    console.log("successful post message create candidates");
  }
}

