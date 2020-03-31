import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  @Input() inputValue: string;
  @Input() labelText: string;
  @Output() valueOutput = new EventEmitter<any>();

  setValue = (event: MatSelectChange) => this.valueOutput.emit(event);

}
