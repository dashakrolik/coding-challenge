import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '@services/admin.service';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})

export class AdminPanelComponent implements OnInit {
  router: Router;
  selectedComponent: string;


  constructor(
    router: Router,
    private adminService: AdminService,
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.adminService.activeComponent.subscribe(location => {
      this.selectedComponent = location;
    });
  }

  getClass = (buttonName: string): string => {
    if (buttonName === this.selectedComponent) {
      return 'selected button';
    } else {
      return 'button';
    }
  }

}
