import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class CustomDialogService {
  dialogRef: MatDialogRef<any> | null = null;

  constructor(public dialog: MatDialog) {
  }

  public openDialog(dialogComponent : ComponentType<any>) {
    this.dialog.open(dialogComponent, {
      panelClass: 'custom-dialog',
    });
  }

  public openDialogAbsolute(button: HTMLElement,dialogComponent : ComponentType<any>) {
    const rect = button.getBoundingClientRect();
    this.dialogRef = this.dialog.open(dialogComponent, {
      panelClass: 'custom-dialog-anchorTopRight',
      position: {
        top: rect.bottom + 'px',
        left: rect.right + 'px',
      },
    });
    if (this.dialogRef) {
      window.addEventListener('resize', () =>
        this.updateDialogPosition(button)
      );
    }
  }

  // Funktion zum Aktualisieren der Dialogposition
  updateDialogPosition(button: HTMLElement): void {
    if (this.dialogRef) {
      const rect = button.getBoundingClientRect();
      this.dialogRef.updatePosition({
        top: rect.bottom + 'px',
        left: rect.right + 'px',
      });
    }
  }
}
