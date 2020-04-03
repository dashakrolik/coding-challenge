import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SubmissionService } from '@service/submission/submission.service';

@Component({
  selector: 'app-submission-table',
  templateUrl: './submission-table.component.html',
  styleUrls: ['./submission-table.component.css']
})
export class SubmissionTableComponent implements OnInit {

  constructor(
    private submissionService: SubmissionService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Submission>;
  @Input() personId: number;
  dataSource: MatTableDataSource<Submission>;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'answer', 'taskId', 'languageId', 'correct'];

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
