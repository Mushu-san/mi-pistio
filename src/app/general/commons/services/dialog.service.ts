import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DialogOptions, DialogResult, SnackBarOptions } from '../classes/Dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogRefs: MatDialogRef<AlertDialogComponent>[] = [];
  snabarRefs: MatSnackBarRef<SnackbarComponent>[] = [];

  lastDialogRef?: MatDialogRef<AlertDialogComponent>;
  lastSnabarRef?: MatSnackBarRef<SnackbarComponent>;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  public show(options: DialogOptions): Promise<DialogResult> {
    return new Promise((resolve, reject) => {
      this.lastDialogRef = this.dialog.open(AlertDialogComponent, {
        data: options,
        autoFocus: false,
        panelClass: 'dialog-panel',
        width: options.width,
        height: options.height,
        maxWidth: options.maxWidth ?? '95vw',
        maxHeight: options.maxHeight ?? '95vh',
        disableClose: options.disableClose
      });

      this.lastDialogRef.disableClose = options.disableClose;

      this.lastDialogRef.afterClosed().subscribe((result: DialogResult) => {
        console.log('afterClosed', result);

        this.dialogRefs.pop();
        this.lastDialogRef = this.dialogRefs[this.dialogRefs.length - 1];
        resolve(result);
      });

      this.dialogRefs?.push(this.lastDialogRef);
    });
  }

  public showSnackBar(options: SnackBarOptions) {
    this.lastSnabarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: options,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-panel'
    });

    this.lastSnabarRef?.afterDismissed().subscribe(() => {
      this.snabarRefs.pop();
      this.lastSnabarRef = this.snabarRefs[this.snabarRefs.length - 1];
    })

    this.snabarRefs?.push(this.lastSnabarRef);
  }

  close(dialogResult?: DialogResult) {
    this.lastDialogRef?.close(dialogResult);
    this.lastSnabarRef?.dismiss();
  }

  closeAll() {
    this.dialog?.closeAll();
    this.snackBar?.dismiss();
  }
}
