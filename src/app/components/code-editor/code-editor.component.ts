import { Component, ViewChild } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/java';
import 'brace/mode/python';

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

  public options = {
    animatedScroll: true,
    showPrintMargin: false,
    tabSize: 2,
    useSoftTabs: true
  };

  chooseLanguage = () => {

  }

  onChange = (event: any) => {
    this.codeSnippet = event;
  }

  submit = () => console.log(this.codeSnippet);

}
