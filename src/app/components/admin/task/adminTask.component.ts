import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-task',
  templateUrl: './adminTask.component.html',
  styleUrls: ['./adminTask.component.css']
})
export class AdminTaskComponent {
  @Input() task: ITask;
}
