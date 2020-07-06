import { Component, Input } from '@angular/core';
import { AdminService } from '@services/admin.service';

@Component({
  selector: 'app-admin-task',
  templateUrl: './adminTask.component.html',
  styleUrls: ['./adminTask.component.css']
})
export class AdminTaskComponent {
  @Input() task: ITask;

  constructor(
    adminService: AdminService,
  ) {
    adminService.activeComponent.next('tasks');
  }
}
