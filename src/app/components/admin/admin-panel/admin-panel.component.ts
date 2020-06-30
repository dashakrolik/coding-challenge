import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    // private taskService: TaskService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // this.tasks$ = this.taskService.getAllTasks();
  }

  goToFeedback = (): Promise<boolean> => this.router.navigate(['/']);
}

