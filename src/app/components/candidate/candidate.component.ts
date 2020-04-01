import { Component, OnInit } from '@angular/core';
import { CandidateService } from '@service/candidate/candidate.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  candidates: Candidate[];

  constructor(
    private candiateService: CandidateService
  ) {
  }

  ngOnInit() {
    this.candiateService.getCandidates().subscribe(
      response => this.candidates = response
    );
  }
}
