import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  @Input() languages:string;
  @Output() valueOutput = new EventEmitter<any>()

  constructor() {
   }
   
  ngOnInit(): void {
  }

  setValue = (event: any) => {
    this.valueOutput.emit(event)
  }
}
