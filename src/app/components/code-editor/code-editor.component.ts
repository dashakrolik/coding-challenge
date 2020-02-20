import { Component, ViewChild } from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/java';

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
    showPrintMargin: false,
    tabSize: 2,
    useSoftTabs: true
  };

}
