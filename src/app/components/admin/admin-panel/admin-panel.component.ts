import { Component, OnInit } from '@angular/core';
import { TaskService } from '@service/task/task.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.tasks$ = this.taskService.getAllTasks();
  }

}

