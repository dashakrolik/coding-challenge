import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { TaskService } from '@services/task/task.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit {
  tasks$: Observable<ITask[]>;

  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.tasks$ = this.taskService.getAllTasks();
  }

}

