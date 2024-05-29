import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class CustomDialogService {
  dialogRef: MatDialogRef<any> | null = null;

  isMobile() {
    return window.innerWidth <= 768;
  }

  constructor(public dialog: MatDialog) {}

  public openDialog(dialogComponent: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(dialogComponent, {
      panelClass: 'custom-dialog',
    });
  }

  public openDialogAbsolute(
    button: HTMLElement,
    dialogComponent: ComponentType<any>,
    position: 'left' | 'right',
    mobilePosition?: 'mid' | 'bottom'
  ) {
    // const rect = button.getBoundingClientRect();
    // let isMobile = window.innerWidth <= 768;
    let positionAsJSON = this.getPosition(button, position, mobilePosition);
    let panelClass = this.getPanelClass(position, mobilePosition);

    // let mPosition = mobilePosition == 'bottom' ? {bottom: '0px', left: '0px'} : {};

    this.dialogRef = this.dialog.open(dialogComponent, {
      panelClass: panelClass,
      position: positionAsJSON,
    });

    if (this.dialogRef) {
      window.addEventListener('resize', () =>
        this.updateDialogPosition(button, position, mobilePosition)
      );
    }
  }

  // Funktion zum Aktualisieren der Dialogposition
  updateDialogPosition(
    button: HTMLElement,
    position: 'left' | 'right',
    mobilePosition?: 'mid' | 'bottom'
  ): void {
    if (this.dialogRef) {
      // const rect = button.getBoundingClientRect();
      // this.dialogRef.updatePosition({
      //   top: this.isMobile() ? '50vh' : rect.bottom + 'px',
      //   left: this.isMobile() ? '50vw' : rect.right + 'px',
      // });
      // let position = mobilePosition == 'bottom' ? {bottom: '0px', left: '0px'} : {};
      let positionAsJSON = this.getPosition(button, position, mobilePosition);
      this.dialogRef.updatePosition(positionAsJSON);
    }
  }

  getPosition(
    button: HTMLElement,
    position: 'left' | 'right',
    mobilePosition?: 'mid' | 'bottom'
  ) {
    if (this.isMobile() && mobilePosition) {
      return this.getMobilePosition(mobilePosition);
    } else {
      const rect = button.getBoundingClientRect();
      return {
        top: rect.bottom + 'px',
        left: position == 'left' ? rect.left + 'px' : rect.right + 'px',
      };
    }
  }

  getMobilePosition(mobilePosition: 'mid' | 'bottom') {
    switch (mobilePosition) {
      case 'mid':
        return {};
      case 'bottom':
        return { left: '0px', bottom: '0px' };
    }
  }

  getPanelClass(position: 'left' | 'right', mobilePosition?: 'mid' | 'bottom') {
    let pannelClass = '';
    pannelClass =
      position == 'left'
        ? 'custom-dialog-anchorTopLeft'
        : 'custom-dialog-anchorTopRight';
    if (mobilePosition) pannelClass += '-mobile';
    return pannelClass;
  }
}
