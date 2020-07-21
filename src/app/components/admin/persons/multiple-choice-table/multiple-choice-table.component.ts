import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MultipleChoiceService } from '@services/multipleChoice/multiple-choice.service';

@Component({
  selector: 'app-multiple-choice-table',
  templateUrl: './multiple-choice-table.component.html',
  styleUrls: ['./multiple-choice-table.component.scss']
})
export class MultipleChoiceTableComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('personId') personId: number;
  @ViewChild(MatTable) table: MatTable<IMultipleChoiceSubmission>;

  dataSource: MatTableDataSource<IMultipleChoiceSubmission>;
  displayedColumns = ['languageId', 'isAnswerCorrect'];

  constructor(
    private multipleChoiceService: MultipleChoiceService,
  ) { }

  ngOnInit(): void {
    this.multipleChoiceService.getSubmissionsByPersonId(this.personId).subscribe(submissions => {
      this.setDataSource(submissions);
    });
  }

  setDataSource = person => {
    this.dataSource = new MatTableDataSource(person);
  }

}
