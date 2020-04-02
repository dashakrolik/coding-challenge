import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SubmissionTableDataSource } from './submission-table-datasource';
import { Submission } from 'src/app/types/Submission.d';
import { SubmissionService } from 'src/app/service/submission/submission.service';

@Component({
  selector: 'app-submission-table',
  templateUrl: './submission-table.component.html',
  styleUrls: ['./submission-table.component.css']
})
export class SubmissionTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Submission>;

  @Input() personId: number;
  dataSource: SubmissionTableDataSource;

  constructor(
    private submissionService: SubmissionService
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'answer', 'taskId', 'languageId', 'correct'];

  ngOnInit() {
    this.dataSource = new SubmissionTableDataSource();
    this.submissionService.getAllSubmissionsFromPerson(this.personId).subscribe(submissions => {
      this.dataSource.data = submissions;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
