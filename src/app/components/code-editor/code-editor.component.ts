import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent {
  @ViewChild('editField') editField: AceEditorComponent;
  text = '';

  public options = {
    animatedScroll: true,
    enableBasicAutocompletion: true,
    showPrintMargin: false,
    tabSize: 2,
    useSoftTabs: true
  };

}
