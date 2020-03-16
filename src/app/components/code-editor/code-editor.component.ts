import { Component, ViewChild } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute, Router } from '@angular/router'
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
  public constructor(private route:ActivatedRoute, private router:Router) {
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

}
