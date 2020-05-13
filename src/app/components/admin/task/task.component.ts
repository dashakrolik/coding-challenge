import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task: ITask;
}
