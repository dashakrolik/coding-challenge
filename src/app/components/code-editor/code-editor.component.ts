import {Component, TemplateRef, ViewChild} from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute, Router } from '@angular/router'
import {SubscribeComponent} from "../overlay/subscribe/subscribe.component";
import {OverlayService} from "../../service/overlay/overlay.service";
import {ComponentType} from "@angular/cdk/portal";
import {Candidate} from "../candidate/Candidate";
import {HttpClientService} from "../../service/http/http-client.service";
// import * as ace from 'brace'
// import 'brace/mode/java'
// import 'brace/mode/python'
// import 'brace/mode/javascript'
// import 'brace/theme/dracula'
// import 'brace/theme/eclipse'
// import 'brace/theme/monokai';

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
  languageOptions: {
    mode: string,
    theme: string
  }
  codeSnippet = '';

  ngOnInit() {
    this.route.paramMap.subscribe(language =>
      this.selectedLanguage = language.get("language")
      )
    this.exerciseId = this.route.firstChild.snapshot.params['id']
    this.isJavascriptTest()
  }

  @ViewChild('editor') editor: AceEditorComponent;
  text = '';
  language = this.selectedLanguage;
  loadJavascriptTask = false;

  ngAftterViewInit() {
    this.setLanguageOptions()
    this.editor.setTheme('ace/theme/monokai')
    this.editor.setMode('ace/mode/javascript')
    this.editor.setOptions({
      animatedScroll: true,
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      mode: this.languageOptions.mode,
      theme: this.languageOptions.theme
    })
  }

  onChange = (event: any) => {
    // console.log('event', event)
    this.codeSnippet = event;
  }

  setLanguageOptions() {
    if (this.selectedLanguage === 'javascript') {
      this.languageOptions.mode = 'javascript'
      this.languageOptions.theme = 'dracula'
    }
    if (this.selectedLanguage === 'java') {
      this.languageOptions.mode = 'java'
      this.languageOptions.theme = "eclipse"
    }
    if (this.selectedLanguage === 'python') {
      this.languageOptions.mode = 'python'
      this.languageOptions.theme = "eclipse"
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
      console.log("subscribing new user, first name: " + res.data.firstName + + " last name: " + res.data.lastName + " email: " + res.data.email);
      // Create a new candidate, for now it has a placeholder for first name and last name.
      // Id is not necessary, it will create an id automatically in the backend.
      let candidate = new Candidate("0", res.data.firstName, res.data.lastName, res.data.email);
      this.httpClientService.createCandidate(candidate).subscribe(
        response => this.handleSuccessfulResponse(response),
      );
    });
  }

  handleSuccessfulResponse(response) {
    // TODO: do something with a successful response
    console.log("successful post message");
  }
}

