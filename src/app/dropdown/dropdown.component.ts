import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  @Input() inputValue:string;
  @Input() labelText:string
  @Output() valueOutput = new EventEmitter<any>()

  setValue (event: any) {
    this.valueOutput.emit(event)
  }
}
