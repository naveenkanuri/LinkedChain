import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../dialogs/confirm/confirm.component';

enum ConfirmDialogType {
  EMPLOYEE,
  EMPLOYER,
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirmDialog(data: any, confirmDialogType: ConfirmDialogType) {
    this.dialog.open(ConfirmComponent, {
      data: {
        _data: data,
        _confirmDialogType: confirmDialogType,
      },
    });
  }
}
