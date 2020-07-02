import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '@services/feedback/feedback.service';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  constructor(
    private feedbackService: FeedbackService
  ) { }

  feedbacks: IFeedback[] = null;

  ngOnInit(): void {
    
    this.feedbackService.getFeedback().pipe(take(1)).subscribe(allFeedback => {
      this.feedbacks = allFeedback;
    });
  }

}
