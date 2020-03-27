import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../service/task/task.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit {
  tasks: Task[]

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }
}
