import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-javascript-task',
  templateUrl: './javascript-task.component.html',
  styleUrls: ['./javascript-task.component.css']
})
export class JavascriptTaskComponent {
  // here onInit we will make a call to the backend to get the task
  taskNumber = 1;
  task = 'Given that the orange square has an id square, move the square to the right by 20px.';
}
