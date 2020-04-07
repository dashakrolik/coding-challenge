import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SubmissionService } from '@service/submission/submission.service';

@Component({
  selector: 'app-submission-table',
  templateUrl: './submission-table.component.html',
  styleUrls: ['./submission-table.component.css'],
  animations: [
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

  expandedAnswer: Submission | null;

  constructor(
    private submissionService: SubmissionService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Submission>;
  @Input() personId: number;
  dataSource: MatTableDataSource<Submission>;

  ngOnInit() {
    this.submissionService.getAllSubmissionsFromPerson(this.personId).subscribe(submissions => {
      this.setDataSource(submissions);
      this.dataSource.sort = this.sort;
    });
  }

  setDataSource = (data: Submission[]) => {
    this.dataSource = new MatTableDataSource(data);
  }
}
