import { Component, Inject, Pipe, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {
  constructor(
    dialog: MatDialog,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.data.message = this.sanitizer.bypassSecurityTrustHtml(this.data.message);
  }

  closeDialog = (): void => {
    this.dialogRef.close();
  }
}
