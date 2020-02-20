import { Component, ViewChild, OnChanges } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/java';
import 'brace/mode/python';

import {JavascriptTaskComponent} from '../output/javascript-task/javascript-task.component';
@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent {
  @ViewChild('editField') editField: AceEditorComponent;
  codeSnippet = '';
  text = '';
  language = 'java';
  loadJavascriptTask = false;

  public options = {
    animatedScroll: true,
    showPrintMargin: false,
    tabSize: 2,
    useSoftTabs: true
  };

  onChange = (event: any) => {
    this.codeSnippet = event;
  }

  doSomething = (event: any) => {
    console.log(event.value);
    if (event.value === 'javascript') {
      this.loadJavascriptTask = true;
    } else {
      this.loadJavascriptTask = false;
    }
  }

  run = () => {
    switch (this.language) {
      case 'javascript':
        eval(this.codeSnippet);
        break;

      case 'java':
        console.log('java');
        break;

      case 'python':
        console.log('python');
        break;
      default:
        console.log('default option in case switch');
    }

  }

}
