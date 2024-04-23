import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-log-out-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './log-out-dialog.component.html',
  styleUrl: './log-out-dialog.component.scss'
})
export class LogOutDialogComponent {
  constructor(public dialogRef: MatDialogRef<LogOutDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
    console.log('Dialog closed'); 
  }

  openCurrentUser(): void {
    console.log('Open profile');
    this.dialogRef.close();
  }

  logOut() {
    console.log('Logging out');
    this.dialogRef.close();
  }
}
