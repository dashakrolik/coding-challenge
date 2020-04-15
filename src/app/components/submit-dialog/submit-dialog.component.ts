import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.css']
})
export class SubmitDialogComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Candidate
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      firstName: 'Sander',
      lastName: 'Kools',
      email: [
        'Sander.Kools@Ordina.nl',
        Validators.compose([Validators.email, Validators.required])
      ]
    });
  }

}
