import {Component, Inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LanguageService} from '@services/language/language.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss']
})
export class CardDialogComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  person: IPerson;
  languages$: Observable<ILanguage[]>;


  constructor(public dialogRef: MatDialogRef<CardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private sanitizer: DomSanitizer,
              private languageService: LanguageService) {
    this.languages$ = languageService.getLanguages();
    this.person = data;
  }

  ngOnInit(): void {
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

}
