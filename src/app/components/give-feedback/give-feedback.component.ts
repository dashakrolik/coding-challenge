import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-give-feedback',
  templateUrl: './give-feedback.component.html',
  styleUrls: ['./give-feedback.component.scss']
})
export class GiveFeedbackComponent implements OnInit {

  feedback: string;

  constructor() { }

  ngOnInit(): void {
  }

  sendFeedback = (): void => {
    if (this.feedback === undefined) {
      console.log("nothing is passed as feedback");
    } else {
      console.log("quick test " + this.feedback);
    }
  }
}
