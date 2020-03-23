import { Component, OnInit } from '@angular/core';
import { HttpClientService } from "../../service/http/http-client.service";

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {

  // Here the candidate names are stored to be used in the html
  candidates: Candidate[];

  constructor(
    private httpClientService: HttpClientService
  ) {
  }

  ngOnInit() {
    this.httpClientService.getCandidates().subscribe(
      response => this.handleSuccessfulResponse(response),
    );
  }

  handleSuccessfulResponse(response) {
    // The response from the backend with the candidates from the database.
    this.candidates = response;
  }
}
