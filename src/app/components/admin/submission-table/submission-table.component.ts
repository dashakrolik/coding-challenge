import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';

import { SubmissionService } from '@services/submission/submission.service';

@Component({
  selector: 'app-submission-table',
  templateUrl: './submission-table.component.html',
  styleUrls: ['./submission-table.component.scss'],
  animations: [
    // TODO: use an ngIf to do this.
    trigger('expandAnswer', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SubmissionTableComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'answer', 'taskId', 'languageId', 'correct'];

  expandedAnswer: ISubmission | null;

  constructor(
    private submissionService: SubmissionService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ISubmission>;
  // TODO: add rule to the  tsconfig to disable the error below
  // tslint:disable-next-line: no-input-rename
  @Input('personId') personId: number;
  dataSource: MatTableDataSource<ISubmission>;

  ngOnInit() {
    this.submissionService.getAllSubmissionsFromPerson(this.personId).pipe(take(1)).subscribe(submissions => {
      this.setDataSource(submissions);
      this.dataSource.sort = this.sort;
    });
  }

  setDataSource = (data: ISubmission[]) => {
    this.dataSource = new MatTableDataSource(data);
  }
}
