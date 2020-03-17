import { Component, ViewChild } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent {
  public constructor(private route:ActivatedRoute) {
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

}
