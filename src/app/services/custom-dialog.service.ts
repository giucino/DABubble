import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class CustomDialogService {
  dialogRef: MatDialogRef<any> | null = null;

  isMobile()  { return window.innerWidth <= 768;}

  constructor(public dialog: MatDialog) {
  }

  public openDialog(dialogComponent : ComponentType<any>) : MatDialogRef<any> {
    return this.dialog.open(dialogComponent, {
      panelClass: 'custom-dialog',
    });
  }

  public openDialogAbsolute(button: HTMLElement,dialogComponent : ComponentType<any>, position: 'left' | 'right', mobilePosition? : 'bottom') {
    const rect = button.getBoundingClientRect();
    // let isMobile = window.innerWidth <= 768;
    let mPosition = mobilePosition == 'bottom' ? {bottom: '0px', left: '0px'} : {};
    if (position == 'left') {
      this.dialogRef = this.dialog.open(dialogComponent, {
        panelClass: 'custom-dialog-anchorTopLeft',
        position: this.isMobile() ? {} : {
          top: rect.bottom + 'px',
          left: rect.left + 'px',
        },
      });
    }
    if (position == 'right') {
      this.dialogRef = this.dialog.open(dialogComponent, {
        panelClass: 'custom-dialog-anchorTopRight',
        position: this.isMobile() ? mPosition : {
          top: rect.bottom + 'px',
          left: rect.left + 'px',
        },
      });
    }
    if (this.dialogRef) {
      window.addEventListener('resize', () =>
        this.updateDialogPosition(button)
      );
    }
  }

  // Funktion zum Aktualisieren der Dialogposition
  updateDialogPosition(button: HTMLElement, mobilePosition? : 'bottom'): void {
    if (this.dialogRef) {
      const rect = button.getBoundingClientRect();
      // this.dialogRef.updatePosition({
      //   top: this.isMobile() ? '50vh' : rect.bottom + 'px',
      //   left: this.isMobile() ? '50vw' : rect.right + 'px',
      // });
      let position = mobilePosition == 'bottom' ? {bottom: '0px', left: '0px'} : {};
      
      this.dialogRef.updatePosition(
        this.isMobile() ? position : {
        top:  rect.bottom + 'px',
        left:  rect.right + 'px',
      });
    }
  }


}
