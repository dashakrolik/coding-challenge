import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '@components/dialog/message-dialog/message-dialog.component';
import { take } from 'rxjs/operators';
import { OkCancelDialogComponent } from '@components/dialog/ok-cancel-dialog/ok-cancel-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
  ) { }

  openMessage = (data: any) => {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '500px',
        data
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe(resolve);
    });
  }

  openOkCancel = (data: any) => {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(OkCancelDialogComponent, {
        width: '500px',
        data
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe((isAccepted: boolean) => {
        if (isAccepted) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }
}