import { Component, OnInit } from '@angular/core';
import { CandidateService } from '@service/candidate/candidate.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  candidates: Candidate[];
  errorMessage: String;

  constructor(
    private candidateService: CandidateService
  ) {
    this.errorMessage = "";
  }

  ngOnInit() {
    this.candidateService.getCandidates().subscribe(
      response => this.candidates = response,
      err => {
        // TODO: show error message on screen
        console.log(err.error.message);
        this.errorMessage = err.error.message;
      }
    );
  }
}
