import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { MessageDialogComponent } from '@components/dialog/message-dialog/message-dialog.component';
import { OkCancelDialogComponent } from '@components/dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { CardDialogComponent } from '@components/dialog/card-dialog/card-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
  ) { }

  openMessage = (data: IDialogData) => {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '500px',
        data
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe(resolve);
    });
  }

  openOkCancel = (data: IDialogData): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(OkCancelDialogComponent, {
        width: '500px',
        data
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe((isAccepted: boolean) => {
        if (isAccepted) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

 openCard(data: any): void {

   const dialogConfig = new MatDialogConfig();

   dialogConfig.disableClose = false;
   dialogConfig.autoFocus = true;
   dialogConfig.width = '500px';
   dialogConfig.data = data;

   const dialogRef = this.dialog.open(CardDialogComponent, dialogConfig);
 }


}
