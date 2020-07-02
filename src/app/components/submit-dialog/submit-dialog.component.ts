import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) private data: IPerson
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      firstName: '',
      lastName: '',
      email: [
        '',
        Validators.compose([Validators.email, Validators.required])
      ]
    });

    // if there's data, fill the formgroup with it
    if (this.data) {
      this.formGroup.patchValue({ ...this.data });
    }
  }

  cancel = () => {
    // TODO implement cancellation
  }

  submit = () => {
    // TODO implement submit
  }

}
