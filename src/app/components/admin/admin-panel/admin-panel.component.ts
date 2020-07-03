import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent {

  constructor(
    // private taskService: TaskService,
    private router: Router,
  ) { }


  goToUsers = (): Promise<boolean> => this.router.navigate(['/admin/users']);
  goToTasks = (): Promise<boolean> => this.router.navigate(['/admin/tasks']);
  goToMultipleChoice = (): Promise<boolean> => this.router.navigate(['/admin/multiplechoice']);
  goToFeedback = (): Promise<boolean> => this.router.navigate(['/admin/feedback']);
}

