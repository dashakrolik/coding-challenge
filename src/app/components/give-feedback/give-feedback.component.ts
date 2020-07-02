import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '@services/feedback/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-give-feedback',
  templateUrl: './give-feedback.component.html',
  styleUrls: ['./give-feedback.component.scss']
})
export class GiveFeedbackComponent implements OnInit {

  feedback: string;

  constructor(
    private router: Router,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit(): void {
  }

  sendFeedback = (): void => {
    if (this.feedback === undefined) {
      alert('please give feedback input before sending feedback');
    } else {
      this.feedbackService.sendFeedback(this.feedback).subscribe(
        response => {
          if (response) {
            this.feedback = '';
            alert('thank you for your feedback');
          }
        }
      );
    }
  }
  
  goHome = (): Promise<boolean> => this.router.navigate(['/']);
}
