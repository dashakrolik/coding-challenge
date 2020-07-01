import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-give-feedback',
  templateUrl: './give-feedback.component.html',
  styleUrls: ['./give-feedback.component.scss']
})
export class GiveFeedbackComponent implements OnInit {

  feedback: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  sendFeedback = (): void => {
    if (this.feedback === undefined) {
      alert('please give feedback before sending feedback');
    } else {
      console.log("quick test " + this.feedback);
    }
  }
  
  goHome = (): Promise<boolean> => this.router.navigate(['/']);
}
