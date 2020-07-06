import { Component, OnInit } from '@angular/core';
import { AdminService } from '@services/admin.service';

@Component({
  selector: 'app-admin-multiple-choice',
  templateUrl: './admin-multiple-choice.component.html',
  styleUrls: ['./admin-multiple-choice.component.scss']
})
export class AdminMultipleChoiceComponent implements OnInit {

  constructor(
    adminService: AdminService,
  ) {
    adminService.activeComponent.next('multiplechoice');
  }

  ngOnInit(): void {
  }

}
