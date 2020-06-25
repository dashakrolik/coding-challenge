import { Component, OnInit } from '@angular/core';
import { MultipleChoiceService } from '@services/multipleChoice/multiple-choice.service';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {

  // tslint:disable-next-line: max-line-length
  introtext = 'This is a placeholder text explaining that we are first going to ask a few multiple choice questions and then later the user gets to program stuff';

  question: IMultipleChoiceQuestion = {
    id: 1,
    question: 'Is the earth flat',
    answerOptions: [
      'Yes',
      'No'
    ]
  };
  selectedAnswer: string;

  constructor(
    multipleChoiceService: MultipleChoiceService,
  ) { }

  ngOnInit(): void {
  }

  pickedAnAnswer = () => {
    console.log(this.selectedAnswer);
  }

  submit = () => {
    if (this.selectedAnswer === 'No') { console.log('moron...'); }
    if (this.selectedAnswer === 'Yes') { console.log('well, this didn\'t say much in terms of programming skill, now did it...'); }
  }

}
